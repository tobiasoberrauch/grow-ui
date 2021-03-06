import {GRID_ITEM_SELECTED} from './action-types';

export function gridItemSelected({name, isCompatible}) {
  return {
    type: GRID_ITEM_SELECTED,
    generator: {
      name,
      isCompatible
    }
  };
}
