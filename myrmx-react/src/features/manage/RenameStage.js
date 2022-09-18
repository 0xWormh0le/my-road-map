import React, { useCallback, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '../common';
import { useUpdateStage } from './redux/hooks';

const schema = yup.object().shape({
  title: yup.string().required(),
});

export default function RenameStage({ className = "", roadmapId, stage, updateRenameStage, hideRenameStageForm }) {
  const { updateStage, updateStagePending } = useUpdateStage();

  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(schema),
  });

  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      register(titleRef.current);

      setTimeout(() => {
        titleRef.current.focus();
      }, 170);
    }
  }, [register, titleRef]);

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
      updateStage({ roadmap: roadmapId, stage: stage.id, title })
        .then(async () => {
          updateRenameStage(stage.id, title);
        })
        .catch(e => handleError(e.response.data));
    },
    [roadmapId, stage.id, updateStage, updateRenameStage, handleError],
  );

  const renderSaveButton = useCallback(
    () => (
      <Button
        className="btn-save ml-2"
        variant="primary"
        disabled={updateStagePending}
        onClick={handleSubmit(handleSaveClick)}
      >
        Save
      </Button>
    ),
    [handleSaveClick, handleSubmit, updateStagePending],
  );

  const renderCancelButton = useCallback(
    buttonClasses => (
      <Button
        className={`btn-cancel ${buttonClasses}`}
        variant="gray"
        disabled={updateStagePending}
        onClick={() => hideRenameStageForm(stage.id)}
      >
        Cancel
      </Button>
    ),
    [hideRenameStageForm, stage.id, updateStagePending],
  );

  return (
    <div className={`manage-rename-stage ${className}`}>
      {updateStagePending && <Loader />}
      <Form inline={true} className={`stage-${stage.id}`}>
        <Form.Control
          className="stage-name-input font-weight-bold"
          name="title"
          defaultValue={stage.id && stage ? stage.title : undefined}
          isInvalid={errors.title}
          ref={titleRef}
        />
        {renderSaveButton()}
        {renderCancelButton('ml-2')}
      </Form>
    </div>
  );
}

RenameStage.propTypes = {};
RenameStage.defaultProps = {};
