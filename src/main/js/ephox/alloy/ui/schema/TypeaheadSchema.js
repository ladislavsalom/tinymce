define(
  'ephox.alloy.ui.schema.TypeaheadSchema',

  [
    'ephox.alloy.api.behaviour.Coupling',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.behaviour.Sandboxing',
    'ephox.alloy.data.Fields',
    'ephox.alloy.parts.PartType',
    'ephox.alloy.ui.common.InputBase',
    'ephox.boulder.api.FieldSchema',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option',
    'ephox.scullion.Cell',
    'ephox.violin.Strings'
  ],

  function (Coupling, Representing, Sandboxing, Fields, PartType, InputBase, FieldSchema, Fun, Option, Cell, Strings) {
    var schema = [
      FieldSchema.option('lazySink'),
      FieldSchema.strict('fetch'),
      FieldSchema.strict('dom'),
      FieldSchema.defaulted('minChars', 5),
      FieldSchema.defaulted('onOpen', Fun.noop),
      FieldSchema.defaulted('onExecute', Option.none),
      FieldSchema.defaulted('matchWidth', true),
      Fields.markers([ 'openClass' ]),

      FieldSchema.state('previewing', function () {
        return Cell(true);
      })
    ].concat(
      InputBase.schema()
    );

    var partTypes = [
      PartType.external(
        { build: Fun.identity },
        'menu',
        function (detail) {
          return { };
        },
        function (detail) {
          return {
            fakeFocus: true,
            onHighlight: function (menu, item) {
              if (! detail.previewing().get()) {
                menu.getSystem().getByUid(detail.uid()).each(function (input) {
                  Representing.setValueFrom(input, item);
                });
              } else {
                // Highlight the rest of the text so that the user types over it.
                menu.getSystem().getByUid(detail.uid()).each(function (input) {
                  // FIX: itemData.value
                  var currentValue = Representing.getValue(input).text;
                  var nextValue = Representing.getValue(item);
                  if (Strings.startsWith(nextValue.text, currentValue)) {
                    Representing.setValue(input, nextValue);
                    input.element().dom().setSelectionRange(currentValue.length, nextValue.text.length);
                  }
                  
                });
              }
              detail.previewing().set(false);
            },
            onExecute: function (menu, item) {
              return menu.getSystem().getByUid(detail.uid()).bind(function (typeahead) {
                var sandbox = Coupling.getCoupled(typeahead, 'sandbox');
                Sandboxing.close(sandbox);
                return item.getSystem().getByUid(detail.uid()).bind(function (input) {
                  // FIX: itemData.text
                  Representing.setValueFrom(input, item);
                  var currentValue = Representing.getValue(input);
                  input.element().dom().setSelectionRange(currentValue.text.length, currentValue.text.length);
                  // Should probably streamline this one.
                  detail.onExecute()(sandbox, input);
                  return Option.some(true);
                });
              });
            },

            onHover: function (menu, item) {
              menu.getSystem().getByUid(detail.uid()).each(function (input) {
                Representing.setValueFrom(input, item);
              });
            }
          };
        }
      )
    ];

    return {
      name: Fun.constant('Typeahead'),
      schema: Fun.constant(schema),
      parts: Fun.constant(partTypes)
    };
  }
);