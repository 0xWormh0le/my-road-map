import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Switch from 'react-switch';
import Modal from 'react-bootstrap/Modal';
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinnerThird } from '@fortawesome/pro-duotone-svg-icons';
import * as yup from 'yup';
import clsx from 'clsx';
import { Header, Loader, CustomDialog } from '../common';
import { useFetchRoadmap } from '../roadmap/redux/hooks';
import { useDeleteRoadmap, useUpdateRoadmap, useFetchCohorts } from './redux/hooks';
import { useFetchUser } from '../user/redux/hooks';
import { useBulkAssignCohorts } from './redux/bulkAssignCohorts';
import useEffectiveBackLink from '../common/useEffectiveBackLinkHook';

const IMAGE_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png"
]

const schema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().nullable(),
  cohort: yup.array().nullable(),
  isPublished: yup.bool(),
  icon: yup.mixed().test('fileFormat', 'Image file only', value => {
    return (value && value.length > 0) ? IMAGE_FORMATS.includes(value[0].type) : true
  }),
  assignToAllUsers: yup.bool(),
})

const fields = [
  { type: 'string', label: 'Roadmap Name', name: 'title'},
  { type: 'text', label: 'Description', name: 'description'},
  // { type: 'file', label: 'Roadmap Icon', name: 'icon' },
  // { type: 'multiselect', label: 'Groups', name: 'cohort', labelKey: 'text'},
  { type: 'switch', label: 'Is Published', name: 'is_published' },
  // { type: 'switch', label: 'Assign Roadmap to all users', name: 'assign_to_all_users' },
]

const multiSelectStyles = {
  control: (styles, state) => {
    const custom = {
      ...styles,
      borderRadius: '0.5em',
    }
    if (state.isFocused) {
      custom.boxShadow = 'none'
    }
    return custom
  }
}

const customComponentDefaultValues = {
  cohort: [],
  is_published: false,
  assign_to_all_users: false,
}

function EditRoadmapDetailsForm({ roadmapId, setSaveButtonProps, onSuccessfulSave, setRoadmap, onDeleteRoadmap }) {
  const [ icon, setIcon ] = useState(null)
  const [ iconFileName, setIconFileName ] = useState(null)
  const { roadmaps, fetchRoadmap } = useFetchRoadmap()
  const { cohorts, fetchCohorts } = useFetchCohorts()
  const { bulkAssignCohorts } = useBulkAssignCohorts()
  const { user } = useFetchUser()
  const { updateRoadmap, updateRoadmapPending } = useUpdateRoadmap()
  const { deleteRoadmapPending } = useDeleteRoadmap()
  const roadmap = roadmaps ? roadmaps[roadmapId] : null
  const defaultCohorts = roadmap && cohorts
    ? cohorts.results.filter(c => roadmap.cohorts.includes(c.id)).map(x => ({ id: x.id, text: x.name }))
    : []
  const multiselectList = {
    cohort: cohorts ? cohorts.results.map(item => ({ id: item.id, text: item.name })) : null,
  }

  const { register, handleSubmit, control, errors, setError } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    fetchCohorts()
  }, [fetchCohorts])

  useEffect(() => {
    fetchRoadmap({ roadmapId });
  }, [roadmapId, fetchRoadmap])

  useEffect(() => {
    if (typeof setRoadmap !== "function") return;
    if (!roadmap) return;
    setRoadmap(roadmap);
  }, [ roadmap, setRoadmap ]);

  const handleError = useCallback(
    err => Object.keys(err).forEach(key => {
      const errors = err[key]
      if (errors.length) {
        setError(key, { message: errors[0], type: 'remote' })
      }
    }),
    [setError]
  )

  const handleSaveClick = useCallback(values => {
    const data = new FormData()
    Object.keys(values).forEach(key => {
      if (key === 'cohort') {
        if (values[key].length === 1) {
          data.append(key, values[key])
        }
      } else if (key === 'icon') {
        if (values.icon.length > 0) {
          data.append(key, values.icon[0])
        }
      } else {
        data.append(key, values[key])
      }
    })
    updateRoadmap({ roadmapId, data})
      .then(() => {
        if (user && user.features.group_specific_roadmaps_enabled && values.cohort.length > 1) {
          return bulkAssignCohorts({
            roadmapId,
            cohorts: values.cohort.map(i => i.id)
          })
        } else {
          return true
        }
      })
      .then(() => onSuccessfulSave())
      .catch(e => handleError(e.response.data))
  }, [roadmapId, user, updateRoadmap, handleError, bulkAssignCohorts, onSuccessfulSave])

  const handleRoadmapIconChange = useCallback(e => {
    const reader = new FileReader()
    const file = e.target.files[0]

    e.preventDefault()
    setIconFileName(file.name)

    if (IMAGE_FORMATS.includes(file.type)) {
      reader.onloadend = () => setIcon(reader.result)
      reader.readAsDataURL(file)
    } else {
      setIcon(false)
    }
  }, [])

  const loader = (!multiselectList.cohort || updateRoadmapPending)

  useEffect(() => setSaveButtonProps({
    onClick: handleSubmit(handleSaveClick),
  }), [
    setSaveButtonProps,
    handleSubmit,
    handleSaveClick,
  ])

  return (<div className="manage-edit-roadmap-details-form">
    {loader && <Loader />}
    {!loader && <>
      <div className="mrm-px-1 mrm-mt-1">
        {fields.map(({ type, name, label, labelKey }) => (
          <Form.Group controlId={name} key={name} className={clsx({'mrm-mb-1 position-relative' : type === 'file'})}>
            <Form.Label>{(label)}</Form.Label>
            { type === 'string' ? (
              <Form.Control
                name={name}
                defaultValue={roadmapId && roadmap && roadmap[name]}
                isInvalid={errors[name]}
                ref={register}
              />
            ) : type === 'text' ? (
              <Form.Control
                name={name}
                as='textarea'
                defaultValue={roadmapId && roadmap && roadmap[name]}
                isInvalid={errors[name]}
                ref={register}
                rows={4}
              />
            ) : type === 'file' ? (
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Button variant="white">
                    <Form.Label>Choose Icon</Form.Label>
                    <Form.Control
                      name={name}
                      type='file'
                      accept='image/*'
                      className="d-none"
                      onChange={handleRoadmapIconChange}
                      ref={register}
                    />
                  </Button>
                  {iconFileName && (
                    <div className="mrm-ml-0_5"><small>{iconFileName}</small></div>
                  )}
                </div>
                {icon ? (
                  <img src={icon} alt="roadmap icon" className='roadmap-icon' />
                ) : icon === false && (
                  <div className={clsx("invalid-icon", {'is-invalid': errors[name]})}>
                    Invalid file format
                  </div>
                )}
              </div>
            ) : (
              <Controller
                name={name}
                control={control}
                defaultValue={roadmapId && roadmap ?
                  (name === 'cohort'
                      ?  defaultCohorts
                      : roadmap[name]
                  )
                  : customComponentDefaultValues[name]}
                render={({ onChange, value }) =>
                  type === 'multiselect' ? (
                    <Select
                      isMulti
                      name={name}
                      value={value}
                      options={multiselectList[name]}
                      getOptionValue={option => option.id}
                      getOptionLabel={option => option[labelKey]}
                      components={{ IndicatorSeparator: null, ClearIndicator: null }}
                      onChange={onChange}
                      styles={multiSelectStyles}
                    />
                  ) : type === 'switch' && (
                    <div className="mrm-mt-0_5">
                      <Switch
                        onChange={onChange}
                        checked={!!value}
                        onColor='#2f80ed'
                      />
                    </div>
                  )
                }
              />
            )}

            {errors[name] && errors[name].type === 'remote' && (
              <small className="error-message">
                {errors[name].message}
              </small>
            )}
          </Form.Group>
        ))}
      </div>
      <hr/>
      {roadmapId && (
        <div className="text-center">
          <Button
            variant="white"
            className="action-button"
            onClick={onDeleteRoadmap}
            disabled={deleteRoadmapPending}
          >
            {deleteRoadmapPending && (
              <FontAwesomeIcon icon={faSpinnerThird} className="mrm-mr-0_25" size="xs" spin />
            )}
            Permanently Delete Roadmap
          </Button>
        </div>
      )}
    </>}
  </div>);
}

export function DeleteRoadmapModal({show, onHide, roadmapId}) {
  const history = useHistory()

  const { deleteRoadmap } = useDeleteRoadmap()

  const handleDeleteDialogConfirm = useCallback(() => {
    deleteRoadmap({ roadmapId }).then(() => history.push('/manage/roadmaps'))
    onHide()
  }, [deleteRoadmap, roadmapId, history, onHide])

  return (<CustomDialog
    text={{
      caption: 'Deleting a Roadmap is permanent. There is no way to undo this.',
      yes: 'Delete'
    }}
    show={show}
    onHide={onHide}
    onYes={handleDeleteDialogConfirm}
  />);
}

export function EditRoadmapDetailsModal({show, onHide, roadmapId, onDeleteRoadmap}) {
  const [saveButtonProps, setSaveButtonProps] = useState({})
  const { updateRoadmapPending } = useUpdateRoadmap()
  const onSuccessfulSave = useCallback(() => onHide(true), [ onHide ]);

  return (<Modal
    show={show}
    onHide={onHide}
    centered
    className={clsx("manage-edit-roadmap-details-modal", { "loading": updateRoadmapPending })}
  >
    <Modal.Header>
      {!updateRoadmapPending && <>
        <Button variant="secondary" onClick={() => onHide()} className="font-weight-bold">
          Cancel
        </Button>
        <h2 className="mrm-mt-1">Edit Roadmap Details</h2>
        <Button {...saveButtonProps}>
          Save Changes
        </Button>
      </>}
    </Modal.Header>
    <Modal.Body>
      <EditRoadmapDetailsForm
        roadmapId={roadmapId}
        setSaveButtonProps={setSaveButtonProps}
        onSuccessfulSave={onSuccessfulSave}
        onDeleteRoadmap={onDeleteRoadmap}
      />
    </Modal.Body>
  </Modal>)
}

export default function EditRoadmapDetailsPage() {
  const [saveButtonProps, setSaveButtonProps] = useState({})
  const [roadmap, setRoadmap] = useState(undefined)
  const [showDeleteRoadmapModal, setShowDeleteRoadmapModal] = useState(false)

  const history = useHistory()
  const { roadmapId } = useParams()

  const defaultBackLink = `/manage/roadmaps/${roadmapId}`;
  const effectiveBackLink = useEffectiveBackLink(defaultBackLink);
  const onSuccessfulSave = useCallback(() => history.push(effectiveBackLink), [ history, effectiveBackLink ]);

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
      {...saveButtonProps}
    >
      Save
    </Button>
  ), [ saveButtonProps ])

  return (
    <div className="manage-edit-roadmap-details-page">
      <Header
        icon="back"
        title="Edit Roadmap Details"
        renderThirdColumn={renderSaveButton}
        thirdColumnClass="text-right"
        colSizes={['auto', undefined, 'auto']}
        border
        renderBackLink={renderBackLink}
        defaultBackLink={defaultBackLink}
      >
        {roadmap && (
          <div className="d-flex align-items-center justify-content-center mrm-mt-1">
            <strong className='mrm-ml-0_5'>{roadmap.title}</strong>
          </div>
        )}
      </Header>

      <EditRoadmapDetailsForm
        roadmapId={roadmapId}
        setSaveButtonProps={setSaveButtonProps}
        onSuccessfulSave={onSuccessfulSave}
        setRoadmap={setRoadmap}
        onDeleteRoadmap={() => setShowDeleteRoadmapModal(true)}
      />

      <DeleteRoadmapModal
        show={showDeleteRoadmapModal}
        onHide={() => setShowDeleteRoadmapModal(false)}
        roadmapId={roadmapId}
      />
    </div>
  );
};

EditRoadmapDetailsPage.propTypes = {};
EditRoadmapDetailsPage.defaultProps = {};
