define(
  'ephox.alloy.menu.widget.WidgetConfig',

  [
    'ephox.alloy.alien.ComponentStructure',
    'ephox.alloy.sandbox.Manager',
    'ephox.boulder.api.FieldPresence',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.highway.Merger',
    'ephox.perhaps.Option',
    'ephox.scullion.Cell',
    'ephox.sugar.api.Body',
    'ephox.sugar.api.Insert'
  ],

  function (ComponentStructure, Manager, FieldPresence, FieldSchema, ValueSchema, Merger, Option, Cell, Body, Insert) {
    var schema = ValueSchema.objOf([
      FieldSchema.strict('lazyHotspot'),

      FieldSchema.strict('onOpen'),
      FieldSchema.strict('onClose'),
      FieldSchema.strict('onExecute'),

      FieldSchema.strict('sink'),
      
      FieldSchema.field(
        'members',
        'members',
        FieldPresence.strict(),
        ValueSchema.objOf([
          FieldSchema.strict('container'),
          FieldSchema.strict('widget')
        ])
      )
    ]);

    return function (rawUiSpec) {
      var uiSpec = ValueSchema.asStructOrDie('WidgetConfig', schema, rawUiSpec);

      var state = Cell(Option.none());

      var build = function (sandbox, data) {
        var container = Merger.deepMerge(
          uiSpec.members().container().munge(rawUiSpec),
          {
            // Always flatgrid.
            uiType: 'widget-container',
            widget: uiSpec.members().widget().munge(data)
          }
        );

        return sandbox.getSystem().build(container);
      };

      var populate = function (sandbox, data) {
        var container = build(sandbox, data);
        sandbox.getSystem().addToWorld(container);
        if (! Body.inBody(container.element())) Insert.append(sandbox.element(), container.element());
        state.set(Option.some(container));
        return state;
      };

      var show = function (sandbox, container) {
        uiSpec.sink().apis().position({
          anchor: 'hotspot',
          hotspot: uiSpec.lazyHotspot()(),
          bubble: Option.none()
        }, container);

        uiSpec.onOpen()(sandbox, container);
      };

      var enter = function (sandbox, state) {
        state.get().each(function (container) {
          show(sandbox, container);
          container.apis().focusIn();
        });
      };

      var preview = function (sandbox, state) {
        state.get().each(function (container) {
          show(sandbox, container);
        });
      };

      var clear = function (sandbox, state) {
        state.get().each(function (container) {
          sandbox.getSystem().removeFromWorld(container);
        });
        state.set(Option.none());
      };

      var isPartOf = function (sandbox, state, queryElem) {
        return state.get().exists(function (container) {
          return ComponentStructure.isPartOf(container, queryElem);
        });
      };

      return {
        sandboxing: {
          manager: Manager.contract({
            clear: clear,
            isPartOf: isPartOf,
            populate: populate,
            preview: preview,
            enter: enter
          }),
          onClose: uiSpec.onClose(),
          sink: uiSpec.sink()
        }
      };
    };
  }
);