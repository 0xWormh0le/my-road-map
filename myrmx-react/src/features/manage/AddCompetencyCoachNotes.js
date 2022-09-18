import React, { useCallback, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '../common';
import { useUpdateCompetency } from './redux/hooks';

const schema = yup.object().shape({
  coach_notes: yup.string().nullable(),
});
export default function AddCompetencyCoachNotes({
  className = '',
  roadmapId,
  stageId,
  competencyId,
  competency,
  fetchStageCompetenciesPending,
  updateCoachNotes,
  hideCoachNotesEditor,
}) {
  const { updateCompetency, updateCompetencyPending } = useUpdateCompetency();
  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    document.getElementById('coach_notes').focus();
  }, []);

  const handleError = useCallback(
    err =>
      Object.keys(err).forEach(key => {
        const errors = err[key];
        if (errors.length) {
          setError(key, { message: errors[0], type: 'remote' });
        }
      }),
    [setError],
  );

  const handleSaveClick = useCallback(
    ({ coach_notes }) => {
      updateCompetency({
        roadmap: roadmapId,
        stage: stageId,
        competency: competencyId,
        coach_notes,
      })
        .then(() => updateCoachNotes())
        .catch(e => handleError(e.response.data));
    },
    [roadmapId, stageId, competencyId, updateCompetency, updateCoachNotes, handleError],
  );

  const renderSaveButton = useCallback(
    () => (
      <Button
        className="btn-save"
        variant="primary"
        disabled={updateCompetencyPending}
        onClick={handleSubmit(handleSaveClick)}
      >
        Save
      </Button>
    ),
    [handleSaveClick, handleSubmit, updateCompetencyPending],
  );

  const renderCancelButton = useCallback(
    buttonClasses => (
      <Button
        className={`btn-cancel ${buttonClasses}`}
        variant="gray"
        disabled={updateCompetencyPending}
        onClick={hideCoachNotesEditor}
      >
        Cancel
      </Button>
    ),
    [hideCoachNotesEditor, updateCompetencyPending],
  );

  return (
    <div className={`manage-add-competency-coach-notes ${className}`}>
      {(fetchStageCompetenciesPending || updateCompetencyPending) && <Loader />}
      {competency && (
        <>
          <Form className="mrm-pt-1">
            <Form.Group controlId="coach_notes">
              <Form.Control
                name="coach_notes"
                as="textarea"
                defaultValue={competency ? competency.coach_notes : undefined}
                isInvalid={errors.coach_notes}
                ref={register}
                placeholder="Add notes for coach"
                rows={4}
              />
            </Form.Group>
          </Form>
          <div className="d-flex align-items-center justify-content-start px-2 my-3">
            {renderSaveButton()}
            {renderCancelButton('ml-3')}
          </div>
        </>
      )}
    </div>
  );
}

AddCompetencyCoachNotes.propTypes = {};
AddCompetencyCoachNotes.defaultProps = {};
