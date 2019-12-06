import {
  CREATE_INSPECTION, FETCH_INSPECTION_LIST, FETCH_INSPECTION, CLEAR_INSPECTION,
  CREATE_INSPECTION_ANSWER,
  FETCH_INSPECTION_ANSWER_LIST,
  FETCH_INSPECTION_ANSWER,
  CLEAR_INSPECTION_ANSWER,
  CLEAR_ACTION_RESULT,
  FETCH_INSPECTION_FOR_EDIT,
  SEARCH_USER,
  CREATE_REMARK,
  FETCH_SAFETY_SELF_INSPECTION,
  FETCH_TEMPLATES,
  FETCH_TEMPLATE,
  EXPORT_INSPECTION,
  EXPORT_INSPECTION_DATA,
  FETCH_SUMMARY,
  CREATE_DRAFT_INSPECTION_ANSWER,
  FETCH_DRAFT_INSPECTION
} from './types';

import { actionForState } from '../../../utils/helpers';

const INITIAL_STATE = {
  inspection: {},
  selfInspection: {},
  createInspectionAction: {},
  fetchInspectionAction: {},
  inspectionList: { results: [] },
  answers: [],
  answer: {
    version: {},
    response: {},
    open_workorders: []
  },
  userlist: [],
  draftAction: {
    success: false, pending: false, error: false
  }
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_INSPECTION.success:
      return {
        ...state,
        createInspectionAction: actionForState(action, 'success', 'success')
      };
    case CREATE_INSPECTION.error:
      return {
        ...state,
        createInspectionAction: actionForState('failed')
      };
    case FETCH_INSPECTION.success:
    case FETCH_INSPECTION_FOR_EDIT.success: {
      let detailFields; let checklistFields;

      if (action.payload.template) {
        // IF THERE IS A TEMPLATE ASOCIATED WE MERGE THE TEMPLATE FIELDS
        // WITH THE INSPECTION CHANGES
        const { sections } = action.payload.template.schema;
        const templatedetailFields = sections[0].fields.map(
          f => action.payload.template.schema.fields.find(fi => fi.id === f)
        ).map(f => ({ ...f, template: true }));

        const templatechecklistFields = sections[1].fields.map(
          f => action.payload.template.schema.fields.find(fi => fi.id === f)
        ).map(f => ({ ...f, template: true }));

        // MERGE AIRPORT CHANGES IN FIELDS WITH TEMPLATES
        let airportFields = action.payload.airport_changes.fields.filter(f => !f.hidden);
        airportFields = airportFields.map((f) => {
          if (sections[0].fields.includes(f.id)) {
            return templatedetailFields.find(tf => tf.id === f.id);
          }
          return f;
        });

        // IF THERE AREN'T CHANGES IN THE SCHEMA, WE MUST RETURN THE TEMPLATE FIELDS
        if (action.payload.airport_changes.fields.length > 0) {
          detailFields = airportFields.sort((a, b) => (a.order < b.order));
        } else {
          detailFields = templatedetailFields;
        }

        // MERGE AIRPORT CHANGES IN CHECKLIST WITH TEMPLATES
        let airportChecklist = action.payload.airport_changes.inspectionChecklist.filter(f => !f.hidden);
        airportChecklist = airportChecklist.map((f) => {
          if (sections[1].fields.includes(f.id)) {
            return templatechecklistFields.find(tf => tf.id === f.id);
          }
          return f;
        });

        // IF THERE AREN'T CHANGES IN THE SCHEMA, WE MUST RETURN THE TEMPLATE FIELDS
        if (action.payload.airport_changes.inspectionChecklist.length > 0) {
          checklistFields = airportChecklist.sort((a, b) => (a.order < b.order));
        } else {
          checklistFields = templatechecklistFields;
        }
      } else {
        const { sections } = action.payload.form.schema;
        detailFields = sections[0].fields.map(
          f => action.payload.form.schema.fields.find(fi => fi.id === f)
        );

        checklistFields = sections[1].fields.map(
          f => action.payload.form.schema.fields.find(fi => fi.id === f)
        );
      }

      return {
        ...state,
        inspection: {
          id: action.payload.id,
          workorders: action.payload.open_workorders,
          template: action.payload.template,
          new_version_available: action.payload.new_version_available,
          version_id: action.payload.form.id,
          info: {
            title: action.type === FETCH_INSPECTION.success
              ? action.payload.title
              : action.payload.form.title,
            icon: action.type === FETCH_INSPECTION.success
              ? action.payload.icon
              : action.payload.form.icon
          },
          airport_changes: action.payload.airport_changes,
          task: action.payload.task,
          details: {
            fields: [...detailFields],
            additionalInfo: action.payload.additionalInfo
          },
          checklist: [...checklistFields]
        },
        fetchInspectionAction: actionForState(action, 'success', 'success')
      };
    }
    case EXPORT_INSPECTION.success: {
      const link = document.createElement('a');
      link.href = action.payload;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    case EXPORT_INSPECTION_DATA.success: {
      const link = document.createElement('a');
      link.href = action.payload;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    case CLEAR_INSPECTION:
      return {
        ...state,
        inspection: {},
        templateList: [],
        template: undefined,
        createInspectionAction: {},
        fetchInspectionAction: {},
        createAction: {},
      };
    case FETCH_INSPECTION_LIST.pending:
      return {
        ...state,
        action: actionForState('loading')
      };
    case FETCH_INSPECTION_LIST.success:
      return {
        ...state,
        inspectionList: action.payload,
        action: actionForState(action, 'success', 'success')
      };
    case FETCH_INSPECTION_LIST.error:
      return {
        ...state,
        action: {
          ...state.action,
          success: false,
          loading: false,
          message: 'failed'
        }
      };
    
    
    case FETCH_SUMMARY.pending:
      return {
        ...state,
        action: actionForState('loading')
      };
    case FETCH_SUMMARY.success:
      return {
        ...state,
        summary: action.payload,
        action: actionForState(action, 'success', 'success')
      };
    case FETCH_SUMMARY.error:
      return {
        ...state,
        action: {
          ...state.action,
          success: false,
          loading: false,
          message: 'failed'
        }
      };

    case FETCH_DRAFT_INSPECTION.success:
      return {
        ...state,
        draft_data: action.payload,
        action: actionForState(action, 'success', 'success')
      };
    

      
    case CREATE_INSPECTION_ANSWER.success:
      return {
        ...state,
        answerCreated: action.payload,
        createAction: actionForState(action, 'success', 'success')
      };
    case CREATE_INSPECTION_ANSWER.error:
      return {
        ...state,
        action: {
          ...state.action,
          success: false,
          loading: false,
          message: 'failed'
        }
      };

    case CREATE_DRAFT_INSPECTION_ANSWER.success:
      return {
        ...state,
        draft_answer: action.payload,
        draftAction: actionForState(state.action, 'success')
      };
    case CREATE_DRAFT_INSPECTION_ANSWER.error:
      return {
        ...state,
        draftAction: actionForState(state.action, 'error')
      };
      case CREATE_DRAFT_INSPECTION_ANSWER.pending:
        return {
          ...state,
          draftAction: actionForState(state.action, 'pending')
      };



    case FETCH_INSPECTION_ANSWER_LIST.success:
      return {
        ...state,
        answers: action.payload
      };
    case FETCH_INSPECTION_ANSWER.success: {
      const theremarks = {};
      const theremarkIds = {};
      const theremarksEdit = [];
      action.payload.remarks.forEach((r) => {
        theremarks[r.field_reference] = {
          ...theremarks[r.field_reference],
          [r.item_reference]: {
            text: r.text,
            image: r.image,
            id: r.id,
            field_reference: r.field_reference,
            item_reference: r.item_reference
          }
        };
        theremarksEdit[r.field_reference] = {
          ...theremarksEdit[r.field_reference],
          [r.item_reference]: {
            text: r.text,
            image: r.image
          }
        };
        theremarkIds[r.field_reference] = {
          ...theremarkIds[r.field_reference],
          [r.item_reference]: r.id
        };
      });
      return {
        ...state,
        answer: {
          ...action.payload,
          remarks: theremarks,
          remarksIDs: theremarkIds,
          remarksEdit: theremarksEdit
        }
      };
    }
    case CLEAR_INSPECTION_ANSWER:
      return {
        ...state,
        answer: {
          version: {},
          response: {}
        },
        answerCreated: {}
      };
    case CLEAR_ACTION_RESULT:
      return {
        ...state,
        action: {},
        templateAction: {},
        fetchInspectionAction: {}
      };
    case SEARCH_USER.success:
      return {
        ...state,
        userlist: action.payload.results
      };
    case CREATE_REMARK.success: {
      return {
        ...state,
        remarkCreated: action.payload
      };
    }
    case FETCH_SAFETY_SELF_INSPECTION.pending:
      return {
        ...state,
        action: actionForState('loading')
      };

    case FETCH_SAFETY_SELF_INSPECTION.success: {
      const filtered = action.payload.form.schema.fields.filter(e => e.type === 'inspection');
      const insp = filtered.reduce((acc, e) => ({
        ...acc,
        [e.id]: {
          title: e.title,
          checklist: e.checklist.map(el => ({ key: el.key, value: el.value }))
        }
      }), {});
      return {
        ...state,
        selfInspection: insp,
        action: actionForState(action, 'success', 'success')
      };
    }
    /* ************************** */
    /*          TEMPLATES         */
    /* ************************** */
    case FETCH_TEMPLATES.success:
      return {
        ...state,
        templateList: action.payload,
        action: actionForState(action, 'success', 'success')
      };
    case FETCH_TEMPLATES.error:
      return {
        ...state,
        action: {
          ...state.action,
          success: false,
          loading: false,
          message: 'failed'
        }
      };
    /* ************************** */
    /*          TEMPLATE          */
    /* ************************** */
    case FETCH_TEMPLATE.success: {
      const { sections } = action.payload.schema;

      const detailFields = sections[0].fields.map(
        f => action.payload.schema.fields.find(fi => fi.id === f)
      ).map((f, i) => ({ ...f, order: i, template: true }));

      const checklistFields = sections[1].fields.map(
        f => action.payload.schema.fields.find(fi => fi.id === f)
      ).map((f, i) => ({ ...f, order: i, template: true }));

      return {
        ...state,
        template: {
          id: action.payload.id,
          new_version_available: action.payload.new_version_available,
          selected_version_id: action.payload.selected_version_id,
          info: {
            title: action.payload.title,
            icon: 'icon-1'
          },
          details: {
            fields: [...detailFields],
            additionalInfo: action.payload.additionalInfo
          },
          checklist: [...checklistFields]
        },
        templateAction: actionForState(action, 'success', 'success')
      };
    }
    case FETCH_TEMPLATE.error:
      return {
        ...state,
        action: {
          ...state.action,
          success: false,
          loading: false,
          message: 'failed'
        }
      };
    default:
      return state;
  }
}
