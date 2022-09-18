import React, { useCallback, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditorTweaked from 'ckeditor-build-classic-tweaked';
import Button from 'react-bootstrap/Button';
import { Loader } from '../common';
import config from '../../common/config';
import { useUpdateCompetency } from './redux/hooks';
import { useFetchAuthToken } from '../home/redux/fetchAuthToken';
export default function AddCompetencySupplementalContent({
  className = '',
  roadmapId,
  stageId,
  competencyId,
  competency,
  fetchStageCompetenciesPending,
  updateSupplementalContent,
  hideSupplementalContentEditor,
}) {
  const { updateCompetency, updateCompetencyPending } = useUpdateCompetency();
  const { authToken } = useFetchAuthToken();
  const [content, setContent] = useState(null);

  const handleSaveClick = useCallback(() => {
    updateCompetency({
      roadmap: roadmapId,
      stage: stageId,
      competency: competencyId,
      content,
    }).then(() => updateSupplementalContent());
  }, [roadmapId, stageId, competencyId, content, updateCompetency, updateSupplementalContent]);

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
        onClick={hideSupplementalContentEditor}
      >
        Cancel
      </Button>
    ),
    [hideSupplementalContentEditor, updateCompetencyPending],
  );

  return (
    <div className={`manage-add-competency-supplemental-content ${className}`}>
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
              data={competency.content}
              onReady={editor => {
                setContent(editor.getData());

                setTimeout(function() {
                  editor.editing.view.focus();
                }, 0);
              }}
              onChange={(event, editor) => setContent(editor.getData())}
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

AddCompetencySupplementalContent.propTypes = {};
AddCompetencySupplementalContent.defaultProps = {};
