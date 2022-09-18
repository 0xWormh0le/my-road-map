import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditorTweaked from 'ckeditor-build-classic-tweaked';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useForm, Controller } from 'react-hook-form';
import xor from 'lodash/xor';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Header, DesktopHeader, Loader } from '../common';
import config from '../../common/config';
import { 
  useFetchStageCompetencies, 
  useFetchCompetencyGlobalActionItems, 
} from '../roadmap/redux/hooks';
import { useFetchUser } from '../user/redux/hooks';
import { 
  useAddGlobalActionItem, 
  useUpdateGlobalActionItem,
} from './redux/hooks';
import { useFetchAuthToken } from '../home/redux/fetchAuthToken';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';

const schema = yup.object().shape({
  aiTitle: yup.string().required(),
  resolutions: yup.array().required(),
})

const resolutions = {
  mark_complete: 'Mark Complete',
  requires_approval: 'Requires Approval',
  attach_file: 'Attach File',
  attach_screen_recording: 'Attach a screen recording',
  input_text: 'Input text response',
}
export default function AddCompetencyActionItemPage() {
  const { roadmapId, stageId, competencyId, actionItemId } = useParams()
  const history = useHistory()
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler()
  const { competencies, fetchStageCompetencies, fetchStageCompetenciesPending } = useFetchStageCompetencies()
  const { actionItems, fetchCompetencyGlobalActionItems, fetchCompetencyGlobalActionItemsPending } = useFetchCompetencyGlobalActionItems();
  const { updateGlobalActionItem } = useUpdateGlobalActionItem()
  const { addGlobalActionItem } = useAddGlobalActionItem()
  const { user } = useFetchUser()
  const { authToken } = useFetchAuthToken()
  const [ description, setDescription] = useState(null)

  const competency = competencies && competencyId ? competencies[competencyId] : null
  const actionItem = actionItems && actionItemId ? actionItems[actionItemId] : null

  const { register, handleSubmit, control, errors, setError } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!roadmapId || !stageId || !user) {
      return
    }
    fetchStageCompetencies({ roadmapId, userId: user.id, stageId }).catch(unauthorizedErrorHandler)
  }, [roadmapId, stageId, user, fetchStageCompetencies, unauthorizedErrorHandler])

  useEffect(() => {
    fetchCompetencyGlobalActionItems({ roadmapId, stageId, competencyId }).catch(unauthorizedErrorHandler)
  }, [roadmapId, stageId, competencyId, fetchCompetencyGlobalActionItems, unauthorizedErrorHandler])

  const handleError = useCallback(
    err => Object.keys(err).forEach(key => {
      const errors = err[key]
      if (errors.length) {
        setError(key, { message: errors[0], type: 'remote' })
      }
    }),
    [setError]
  )

  const defaultBackLink = `/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}`;
  const effectiveBackLink = useEffectiveBackLink(defaultBackLink);
  const handleSaveClick = useCallback(({aiTitle, resolutions}) => {
    if (actionItemId) {
      updateGlobalActionItem({roadmapId, stageId, competencyId, actionItemId, aiTitle, aiDescription: description, resolutions})
        .then(() => history.push(effectiveBackLink))
        .catch(e => handleError(e.response.data))
    } else {
      addGlobalActionItem({roadmapId, stageId, competencyId, aiTitle, aiDescription: description, resolutions})
        .then(() => history.push(effectiveBackLink))
        .catch(e => handleError(e.response.data))
    }
  }, [
    roadmapId,
    stageId,
    competencyId,
    actionItemId,
    description,
    history,
    addGlobalActionItem,
    updateGlobalActionItem,
    handleError,
    effectiveBackLink,
  ])

  const renderBackLink = useCallback((effectiveBackLink) => (
    <Link to={effectiveBackLink}>
      <Button className="btn-cancel" variant="white" >
        Cancel
      </Button>
    </Link>
  ), [])

  const renderSaveButton = useCallback(() => (
    <Button
      className="btn-save"
      variant="white"
      onClick={handleSubmit(handleSaveClick)}
    >
      Save
    </Button>
  ), [handleSaveClick, handleSubmit])

  return (
    <div className="manage-add-competency-action-item-page">
      <Header
        icon="back"
        title={actionItemId ? 'Edit Action Item' : 'Add Action Item'}
        renderThirdColumn={renderSaveButton}
        thirdColumnClass="text-right"
        colSizes={['auto', undefined , 'auto']}
        border
        renderBackLink={renderBackLink}
        defaultBackLink={defaultBackLink}
      >
        {competency && (
          <div className="d-flex align-items-center justify-content-center mt-3">
            <strong className='mrm-ml-0_75'>{competency.title}</strong>
          </div>
        )}
      </Header>
      <DesktopHeader replacePrimaryContent={true}>
        <Container>
          <Row>
            <Col xs={1}>
              <Link className="btn-cancel" to={defaultBackLink}>
                <Button  variant="gray">
                  Cancel
                </Button>
              </Link>
            </Col>
            <Col xs={10}>
              <h2 className="text-center mrm-my-2">{actionItemId ? 'Edit Action Item' : 'Add Action Item'}</h2>
            </Col>
            <Col xs={1}>
              {renderSaveButton()}
            </Col>
          </Row>
        </Container>
      </DesktopHeader>
      {(fetchStageCompetenciesPending || fetchCompetencyGlobalActionItemsPending) && <Loader />}
      <Form className='mrm-p-1 container normal-width-container'>
        <Form.Group controlId='aiTitle'>
          <Form.Label>
            Action Item Name
          </Form.Label>
          <Form.Control
            name='aiTitle'
            defaultValue={actionItem ? actionItem.aiTitle : undefined }
            isInvalid={errors.aiTitle}
            ref={register}
            placeholder='Add action item name'
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            Description
          </Form.Label>
          <CKEditor
              editor={ ClassicEditorTweaked }
              style={{
                'height': '200px',
              }}
              config={{
                simpleUpload: {
                  uploadUrl: `${config.apiRootUrl}/ckeditor/upload/`,
                  headers: {
                    Authorization: `Token ${authToken}`,
                  }
                }
              }}
              data={actionItem && actionItem.aiDescription}
              onReady={editor => setDescription(editor.getData())}
              onChange={(event, editor) => setDescription(editor.getData())}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            What do you want the user to do?
          </Form.Label>
          <Controller
            name='resolutions'
            control={control}
            defaultValue={actionItem ? actionItem.resolutions : []}
            render={({ onChange, value }) =>
              <div className="mrm-mt-0_75 mrm-ml-0_25">
                {Object.keys(resolutions).map(resolution => (
                  <Form.Check
                    type="checkbox"
                    key={resolution}
                    id={resolution}
                    label={resolutions[resolution]}
                    isInvalid={errors['resolutions']}
                    checked={value && value.includes(resolution)}
                    onChange={() => onChange(xor(value, [resolution]))}
                    className="mrm-mr-1 mrm-mt-0_5"
                  />
                ))}
              </div>
            }
          />
        </Form.Group>
      </Form>
    </div>
  );
};

AddCompetencyActionItemPage.propTypes = {};
AddCompetencyActionItemPage.defaultProps = {};
