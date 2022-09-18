import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditorTweaked from 'ckeditor-build-classic-tweaked';
import Button from 'react-bootstrap/Button';
import { Header, Loader } from '../common';
import config from '../../common/config';
import { useFetchStageCompetencies } from '../roadmap/redux/hooks';
import { useFetchUser } from '../user/redux/hooks';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import { useUpdateCompetency } from './redux/hooks';
import { useFetchAuthToken } from '../home/redux/fetchAuthToken';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';

export default function AddCompetencySupplementalContentPage() {
  const { roadmapId, stageId, competencyId } = useParams()
  const history = useHistory()
  const unauthorizedErrorHandler = useUnauthorizedErrorHandler()
  const { competencies, fetchStageCompetencies, fetchStageCompetenciesPending } = useFetchStageCompetencies()
  const { updateCompetency, updateCompetencyPending } = useUpdateCompetency()
  const { user } = useFetchUser()
  const { authToken } = useFetchAuthToken()
  const [ content, setContent ] = useState(null)

  const competency = competencies && competencyId ? competencies[competencyId] : null

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!roadmapId || !stageId || !user) {
      return
    }
    fetchStageCompetencies({ roadmapId, userId: user.id, stageId }).catch(unauthorizedErrorHandler)
  }, [roadmapId, stageId, user, fetchStageCompetencies, unauthorizedErrorHandler])

  const defaultBackLink = `/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${competencyId}`;
  const effectiveBackLink = useEffectiveBackLink(defaultBackLink);
  const handleSaveClick = useCallback(() => {
    updateCompetency({ roadmap: roadmapId, stage: stageId, competency: competencyId, content})
      .then(() => history.push(effectiveBackLink))
  }, [roadmapId, stageId, competencyId, content, history, updateCompetency, effectiveBackLink])

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
      disabled={updateCompetencyPending}
      onClick={handleSaveClick}
    >
      Save
    </Button>
  ), [handleSaveClick, updateCompetencyPending])

  return (
    <div className="manage-add-competency-supplemental-content-page">
      <Header
        icon="back"
        title="Supplemental Content"
        renderThirdColumn={renderSaveButton}
        thirdColumnClass="text-right"
        colSizes={['auto', undefined , 'auto']}
        border
        renderBackLink={renderBackLink}
        defaultBackLink={defaultBackLink}
      >
        {competency && (
          <div className="d-flex align-items-center justify-content-center mrm-mt-1">
            <strong className='mrm-ml-0_75'>{competency.title}</strong>
          </div>
        )}
      </Header>
      { (fetchStageCompetenciesPending || updateCompetencyPending) && <Loader /> }
      { competency &&
        <div className="mrm-mt-1 mrm-px-0_5">
          <CKEditor
            editor={ ClassicEditorTweaked }
            config={{
              simpleUpload: {
                uploadUrl: `${config.apiRootUrl}/ckeditor/upload/`,
                headers: {
                  Authorization: `Token ${authToken}`,
                }
              },
              mediaEmbed: {
                previewsInData: true
              }
            }}
            data={competency.content}
            onReady={editor => setContent(editor.getData())}
            onChange={(event, editor) => setContent(editor.getData())}
          />
        </div>
      }
    </div>
  );
};

AddCompetencySupplementalContentPage.propTypes = {};
AddCompetencySupplementalContentPage.defaultProps = {};
