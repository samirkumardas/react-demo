import { createStore } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { fromJS } from 'immutable';


export const insertSlot =  createAction('INSERT_SLOT');
export const setSlot =  createAction('SET_SLOT');
export const deleteSlot =  createAction('DELETE_SLOT');
export const updateSelectedSlot =  createAction('UPDATE_SELECTED_SLOT');
export const clearSelection =  createAction('CLEAR_SELECTION');

/* Request to API */


export const fetchSlotsReq =  createAction('FETCH_SLOTS_REQ');
export const slotSaveReq =  createAction('SLOT_SAVE_REQ');
export const slotDetailReq =  createAction('SLOT_DETAIL_REQ');

export const saveFailed =  createAction('SLOT_SAVE_FAILED');
export const slotDetailSuccess =  createAction('SLOT_DETAIL_SUCCESS');
export const slotDetailFailed =  createAction('SLOT_DETAIL_FAILED');


const findIndexFromList = (list, key, find) => {
    return list.findIndex(item => item.get(key) === find);
};

const getAllSlodIds = (slots) => {
     const slotsId = [];
     slots.forEach(slot => slotsId.push(slot.id));
     return slotsId;
};

const onSelectionChange = (state, payload) => {
    let selected = state.get('selected'),
        index,
        [id,filteredSlots] = payload;
    
    id = parseInt(id, 10);
    /* checkbox was "CheckALl" one */
    if (id === 0) {
        selected = (filteredSlots.size === selected.size) ?
            selected.clear() : selected.clear().concat(getAllSlodIds(filteredSlots));
    } else {
        index= selected.findIndex(item => item === id);
        if (index === -1) {
            selected = selected.push(id);
        } else {
            selected = selected.delete(index);
        }
    }

    return state.set('selected', selected);
};

const doSetSlot = (state, slot) => {
    let slots = state.get('slots'),
        id = parseInt(slot.id,10),
        index;
    if (id) {
        index = findIndexFromList(slots, 'id', id);
        slots = slots.set(index, slot);
    } else {
        slots = slots.push(slot);
    }

    return state.set('slots', slots);
};

const initialState = fromJS({
    slots: [],
    selected: [],
    formData: {}
});

const adslots = createReducer({
    [insertSlot]: (state, payload) => state.update('slots', slots => slots.concat(payload)),
    [setSlot]: (state, payload) => doSetSlot(state, payload),
    [deleteSlot]: (state, payload) => state.update('slots', slots => slots.delete(findIndexFromList(slots, 'id', payload))),
    [clearSelection]: (state, payload) => state.set('selected').clear(),
    [updateSelectedSlot]: (state, payload) => onSelectionChange(state, payload),
    [slotDetailSuccess]: (state, payload) => state.set('formData', fromJS(payload)),
    [slotDetailFailed]: (state, payload) => state.set('formData', fromJS({dataError:true}))
}, initialState);

export default adslots;