import React, { useCallback, useEffect } from 'react';
import { useParams, useLocation, Link, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Header, Loader } from '../common';
import { useAddCompetency } from './redux/hooks';
import useQuery from '../common/useQuery';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';

const schema = yup.object().shape({
  title: yup.string().required()
})

export default function AddStageCompetencyPage() {
  const { roadmapId, stageId } = useParams()
  const location = useLocation()
  const history = useHistory()
  const { addCompetency, addCompetencyPending } = useAddCompetency()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(schema)
  })

  const query = useQuery();
  const studentId = query && Number(query.get('student'));

  const defaultBackLink = `/manage/roadmaps/${roadmapId}`;
  const effectiveBackLink = useEffectiveBackLink(defaultBackLink);

  const renderBackLink = useCallback((effectiveBackLink) => (
    <Link to={effectiveBackLink}>
      <Button className="btn-cancel" variant="white">
        Cancel
      </Button>
    </Link>
  ), [])
  
  const handleError = useCallback(
    err => Object.keys(err).forEach(key => {
      const errors = err[key]
      if (errors.length) {
        setError(key, { message: errors[0], type: 'remote' })
      }
    }),
    [setError]
  )


  const handleSaveClick = useCallback(({ title }) => {
    const payload = { roadmapId, title, stage: stageId };
    if (studentId) payload.student = studentId;
    addCompetency(payload)
      .then(newCompetency => {
        if (location.editCompetency) {
          const location = {
            pathname: `/manage/roadmaps/${roadmapId}/stages/${stageId}/competencies/${newCompetency.id}`,
            state: { backLink: effectiveBackLink }
          }
          history.push(location);
        } else {
          history.push(effectiveBackLink);
        }
      })
      .catch(e => handleError(e.response.data))
  }, [roadmapId, stageId, studentId, location, history, addCompetency, handleError, effectiveBackLink])

  const renderSaveButton = useCallback(() => (
    <Button
      className="btn-save"
      variant="white"
      onClick={handleSubmit(handleSaveClick)}
    >
      Create
    </Button>
  ), [handleSubmit, handleSaveClick])

  return (
    <div className="manage-add-stage-competency-page">
      <Header
        renderThirdColumn={renderSaveButton}
        title="Add Competency"
        thirdColumnClass="text-right"
        colSizes={[3, 6, 3]}
        border
        renderBackLink={renderBackLink}
        defaultBackLink={defaultBackLink}
      />

      { addCompetencyPending && <Loader /> }

      <Form className='mrm-p-1'>
        <Form.Group controlId='title'>
          <Form.Label>Competency Name</Form.Label>
          <Form.Control
            name='title'
            defaultValue={undefined}
            isInvalid={errors.title}
            ref={register}
          />
        </Form.Group>
      </Form>
    </div>
  );
};

AddStageCompetencyPage.propTypes = {};
AddStageCompetencyPage.defaultProps = {};
