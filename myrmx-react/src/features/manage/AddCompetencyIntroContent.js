import React, { useCallback, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditorTweaked from 'ckeditor-build-classic-tweaked';
import Button from 'react-bootstrap/Button';
import { Loader } from '../common';
import config from '../../common/config';
import { useUpdateCompetency } from './redux/hooks';
import { useFetchAuthToken } from '../home/redux/fetchAuthToken';

export default function AddCompetencyIntroContent({
  className = '',
  roadmapId,
  stageId,
  competencyId,
  competency,
  fetchStageCompetenciesPending,
  updateIntroContent,
  hideIntroContentEditor,
}) {
  const { updateCompetency, updateCompetencyPending } = useUpdateCompetency();
  const { authToken } = useFetchAuthToken();
  const [description, setDescription] = useState(null);

  const handleSaveClick = useCallback(() => {
    updateCompetency({
      roadmap: roadmapId,
      stage: stageId,
      competency: competencyId,
      description,
    }).then(() => updateIntroContent());
  }, [roadmapId, stageId, competencyId, description, updateCompetency, updateIntroContent]);

  const renderSaveButton = useCallback(
    () => (
      <Button
        className="btn-save"
        variant="primary"
        disabled={updateCompetencyPending}
        onClick={handleSaveClick}
      >
        Save
      </Button>
    ),
    [handleSaveClick, updateCompetencyPending],
  );

  const renderCancelButton = useCallback(
    buttonClasses => (
      <Button
        className={`btn-cancel ${buttonClasses}`}
        variant="gray"
        disabled={updateCompetencyPending}
        onClick={hideIntroContentEditor}
      >
        Cancel
      </Button>
    ),
    [hideIntroContentEditor, updateCompetencyPending],
  );

  return (
    <div className={`manage-add-competency-intro-content ${className}`}>
      {(fetchStageCompetenciesPending || updateCompetencyPending) && <Loader />}
      {competency && (
        <>
          <div className="mrm-mt-1">
            <CKEditor
              editor={ClassicEditorTweaked}
              config={{
                simpleUpload: {
                  uploadUrl: `${config.apiRootUrl}/ckeditor/upload/`,
                  headers: {
                    Authorization: `Token ${authToken}`,
                  },
                },
                mediaEmbed: {
                  previewsInData: true,
                },
              }}
              data={competency.description}
              onReady={editor => {
                setDescription(editor.getData());

                setTimeout(function() {
                  editor.editing.view.focus();
                }, 0);
              }}
              onChange={(event, editor) => setDescription(editor.getData())}
            />
          </div>
          <div className="d-flex align-items-center justify-content-start px-2 my-3">
            {renderSaveButton()}
            {renderCancelButton('ml-3')}
          </div>
        </>
      )}
    </div>
  );
}

AddCompetencyIntroContent.propTypes = {};
AddCompetencyIntroContent.defaultProps = {};
