import { assert, UnitTest } from '@ephox/bedrock-client';
import { SugarElement } from '@ephox/sugar';
import * as Structs from 'ephox/snooker/api/Structs';
import { Warehouse } from 'ephox/snooker/api/Warehouse';
import * as Blocks from 'ephox/snooker/lookup/Blocks';

UnitTest.test('BlocksTest', () => {
  const s = (fakeEle: any, rowspan: number, colspan: number) => Structs.detail(fakeEle as SugarElement, rowspan, colspan);
  const f = (fakeEle: any, cells: Structs.Detail[], section: 'tbody' | 'thead' | 'tfoot') => Structs.rowdata(fakeEle as SugarElement, cells, section);
  const warehouse = Warehouse.generate([
    f('r1', [ s('a', 1, 1), s('b', 1, 2) ], 'thead'),
    f('r2', [ s('c', 2, 1), s('d', 1, 1), s('e', 1, 1) ], 'tbody'),
    f('r2', [ s('f', 1, 1), s('g', 1, 1) ], 'tbody'),
    f('r3', [ s('h', 1, 1), s('i', 1, 2) ], 'tfoot')
  ]);

  assert.eq([ 'a', 'd', 'e' ], Blocks.columns(warehouse).map((c) => {
    return c.getOrDie();
  }));
});
