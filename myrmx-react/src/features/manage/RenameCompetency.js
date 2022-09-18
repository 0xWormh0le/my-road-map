import React, { useCallback, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'react-bootstrap/Button';
import { Loader } from '../common';
import { useUpdateCompetency } from './redux/hooks';

const schema = yup.object().shape({
  title: yup.string().required(),
});
export default function RenameCompetency({
  roadmapId,
  stageId,
  competencyId,
  competency,
  fetchStageCompetenciesPending,
  updateRenameCompetency,
  hideRenameCompetencyForm,
}) {
  const { updateCompetency, updateCompetencyPending } = useUpdateCompetency();

  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setTimeout(() => {
      const inputElement = document.getElementsByName('title')[1];
      !!inputElement && inputElement.focus();
    }, 165);
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
    ({ title }) => {
      updateCompetency({ roadmap: roadmapId, stage: stageId, competency: competencyId, title })
        .then(() => updateRenameCompetency())
        .catch(e => handleError(e.response.data));
    },
    [roadmapId, stageId, competencyId, updateCompetency, updateRenameCompetency, handleError],
  );

  const renderSaveButton = useCallback(
    () => (
      <Button
        className="btn-save ml-2"
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
        onClick={hideRenameCompetencyForm}
      >
        Cancel
      </Button>
    ),
    [hideRenameCompetencyForm, updateCompetencyPending],
  );

  return (
    <div className="manage-rename-competency">
      {(fetchStageCompetenciesPending || updateCompetencyPending) && <Loader />}
      <Form inline={true} className="mrm-p-1">
        <Form.Control
          className="competency-name-input font-weight-bold text-center"
          name="title"
          defaultValue={competency ? competency.title : undefined}
          isInvalid={errors.title}
          ref={register}
          placeholder="Competency Name"
        />
        {renderSaveButton()}
        {renderCancelButton('ml-2')}
      </Form>
    </div>
  );
}

RenameCompetency.propTypes = {};
RenameCompetency.defaultProps = {};
