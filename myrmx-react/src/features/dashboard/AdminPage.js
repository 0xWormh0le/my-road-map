import React, { useEffect, useMemo, useCallback, useState, useRef, Fragment } from 'react';
// import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import capitalize from 'lodash/capitalize';
import intersection from 'lodash/intersection';
import { Link, useHistory, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartArea, faSort, faSearch } from '@fortawesome/pro-solid-svg-icons';
import { faEllipsisH, faClock } from '@fortawesome/pro-regular-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useFetchAssignedUsers } from './redux/hooks';
import Roadmap from './components/Roadmap';
import { Loader, ActionMenu, UserAvatar, DesktopHeader } from '../common';
import { EditUserRoadmapModal } from '../manage';
import { useFetchUpdates } from '../common/redux/hooks';
import { useFetchUser } from '../user/redux/hooks';
import usePagination from '../common/usePagination';
import raiseHandIcon from '../../images/icons/raise-hand.svg';

dayjs.extend(relativeTime)

function SortMenuItem(props) {
  return <Form.Check
    type='radio'
    name='sort'
    {...props}
  />;
}

const SortMenu = ({ show, onHide, onSort, value, sortByOptions }) => {
  return (
    <Modal
      className={clsx(
        "dashboard-admin-page",
        "sort-menu",
        "modal-mobile-slide-from-bottom"
      )}
      show={show}
      onHide={onHide}
      >
      <Modal.Body className="text-center p-0">
        <div className="position-relative mrm-px-1 mrm-pt-1 border-bottom">
          <div className='position-absolute font-weight-bold cancel' onClick={onHide}>Cancel</div>
          <p className="font-weight-bold text-normal">Sort by</p>
        </div>
        <Form>
          {sortByOptions.map(({ label, field }, key) => (
            <SortMenuItem
              key={key}
              defaultChecked={field === value}
              onClick={onSort(field)}
              id={`sort-${key}`}
              label={label}
              className="mrm-py-1"
            />
          ))}
        </Form>
      </Modal.Body>
    </Modal>
  )
}

// const EllipsisMenuToggle = React.forwardRef(({ children, onClick }, ref) => {
//   return <Button
//     className="btn-detail btn-secondary"
//     ref={ref}
//     onClick={(e) => {
//       e.preventDefault();
//       onClick(e);
//     }}
//   >
//     <FontAwesomeIcon icon={faEllipsisH} />
//   </Button>;
// });

const SortMenuToggle = React.forwardRef(({ children, onClick, sortByLabel }, ref) => {
  return <Button
    className="sort sort-desktop"
    variant="white"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    Sort by:
    {sortByLabel && <span className="sort-by-label">{sortByLabel}</span>}
    <FontAwesomeIcon icon={faCaretDown} />
  </Button>;
});

const UserCard = (
  {
    user,
    onDetail,
    toggleShowRoadmaps = true,
    canEditAssign,
    handleEditUserRoadmapClick,
  }
) => {
  const [showRoadmaps, setShowRoadmaps] = useState(!toggleShowRoadmaps)

  const { updates } = useFetchUpdates()
  const location = useLocation()

  const handleClick = useCallback(e => setShowRoadmaps(s => !s), [])

  const isRoadmapUnseen = useCallback(roadmapId => {
    if (!!updates?.unseen_activity?.[user.id]) {
      return updates.unseen_activity[user.id].roadmaps.includes(roadmapId)
    }
    return false
  }, [updates, user])

  const hasUnseenRoadmap = useMemo(() => {
    if (!!updates?.unseen_activity?.[user.id]) {
      return intersection(updates.unseen_activity[user.id].roadmaps, user.roadmaps_info.map(i => i.id)).length > 0
    }
    return false
  }, [updates, user])

  return (
    <Card
      onClick={toggleShowRoadmaps ? handleClick : undefined}
      className={clsx('mrm-mb-1 student-card', {'toggle-show-roadmaps': toggleShowRoadmaps})}
    >
      <Card.Body className="position-relative mrm-py-0_75 mrm-px-1">
        <Link
          className="more-btn-desktop"
          onClick={typeof onDetail === "function" ? onDetail : undefined}
        >
          <FontAwesomeIcon icon={faEllipsisH} />
        </Link>
        {/* <Dropdown className="d-none d-lg-block">
          <Dropdown.Toggle as={EllipsisMenuToggle} />
          <Dropdown.Menu align="right">
            <Dropdown.Item as={Link} to={`/manage/user/${user.id}`}>
              View Profile
            </Dropdown.Item>
            {canEditAssign && <Dropdown.Item onClick={handleEditUserRoadmapClick}>
              Edit Assigned Roadmaps
            </Dropdown.Item>}
          </Dropdown.Menu>
        </Dropdown> */}
        {hasUnseenRoadmap && (
          <span className="student-dot dot float-left" />
        )}
        <div className="d-flex">
          <UserAvatar user={user} className="mrm-mr-0_5" />
          <div className="my-auto">
            <p className="mb-0 name">
              <strong>{capitalize(user.first_name)} {capitalize(user.last_name)}</strong>
            </p>
            {user.red_assessments_count > 0 && (
              <span className="item-count red-count">
                <img src={raiseHandIcon} alt="" />
                {user.red_assessments_count}
              </span>
            )}
            {user.approval_pending_items_count > 0 && (
              <span className="item-count gray-count">
                <FontAwesomeIcon icon={faClock} size='xs' />
                {user.approval_pending_items_count}
              </span>
            )}
          </div>
        </div>
        {showRoadmaps && (
          user.roadmaps_info.length > 0
            ? user.roadmaps_info.map(roadmap => (
                <Link
                  key={roadmap.id}
                  to={{
                    pathname: `/roadmap/${roadmap.id}`,
                    search: `?user=${user.id}`,
                    state: { backLink: location },
                  }}
                  className="student-card-roadmap-link"
                >
                  <Roadmap
                    unseen={isRoadmapUnseen(roadmap.id)}
                    data={roadmap}
                    className="mt-3"
                  />
                </Link>
              ))
            : <div className="no-data theme-text-light">No Roadmaps</div>
        )}
        <p className="last-login text-lighter mt-2">
          Last login: <strong>
            {user.last_login ? dayjs(user.last_seen).fromNow() : "Never"}
          </strong>
        </p>
      </Card.Body>
    </Card>
  )
}

function AdminPageHeader(
  {
    type,
    replaceStringWithSynonyms,
    assignedUsers,
    handleSearchChange,
    handleSortClick,
    sortByOptions = [],
    sortByValue,
    onSort,
  }
) {
  const sortByLabel = sortByOptions.filter(o => o.field === sortByValue)[0];

  return (<>
    <div className="text-right mrm-mb-0_75 d-none">
      {/* TODO: Restore button displaying when it'll make sense */}
      {/* Explicit inline styling to hide the button is intended to make it stand out more */}
      <Button variant="white">
        <FontAwesomeIcon icon={faChartArea} size='xs' />
        Roadmap Stats
      </Button>
    </div>

    <h2 className="dashboard-title theme-text-normal mrm-mb-1">
      {type === 'Admin' ? 'All' : 'My'} {replaceStringWithSynonyms('Students')}&nbsp;
      {assignedUsers && <strong>({assignedUsers.count})</strong>}
    </h2>

    <div className="d-flex justify-content-between mrm-mb-1">
      <div className="common-search-bar">
        <Form.Control
          className='search'
          placeholder='Search for someone...'
          onChange={handleSearchChange}
        />
        <FontAwesomeIcon icon={faSearch} size="xs" className="search-icon" />
      </div>
      <Button
        className="sort d-lg-none"
        variant="white"
        onClick={typeof handleSortClick === "function" ? handleSortClick : undefined}
      >
        <FontAwesomeIcon icon={faSort} size='xs' />
        Sort
      </Button>
      <Dropdown className="d-none d-lg-block">
        <Dropdown.Toggle as={SortMenuToggle} sortByLabel={sortByLabel && sortByLabel.label} />
        <Dropdown.Menu align="right">
          <Form>
            {sortByOptions.map(({ label, field }, key) => (<Fragment key={key}>
              {key !== 0 && <Dropdown.Divider />}
              <Dropdown.Item
                as={SortMenuItem}
                onClick={onSort(field)}
                defaultChecked={field === sortByValue}
                label={label}
                id={`sort-${key}`}
              />
            </Fragment>))}
          </Form>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </>);
}

export default function AdminPage() {
  const { assignedUsers, fetchAssignedUsersPending, fetchAssignedUsers } = useFetchAssignedUsers();

  const { user, replaceStringWithSynonyms } = useFetchUser()

  const history = useHistory()
  const location = useLocation()

  const [detailMenu, setDetailMenu] = useState(null)

  const [sortMenu, setSortMenu] = useState(false)

  const [sortBy, setSortBy] = useState(null)

  const search = useRef(null)

  const type = history.location.pathname === '/dashboard/admin' ? 'Admin' : 'Coach'

  const { resetPage } = usePagination({
    fetchAction: fetchAssignedUsers,
    actionArgs: {
      role: type.toLowerCase(),
      search: search.current,
      ordering: sortBy
    },
    requestNextPage: () => assignedUsers && assignedUsers.next && !fetchAssignedUsersPending
  })

  const userGroups = user ? user.groups : []

  const canEditAssign = (user ? !!user.features.coach_can_assign_roadmaps : false) || userGroups.includes('Admin');

  useEffect(() => {
    fetchAssignedUsers({
      role: type.toLowerCase(),
      page: 0,
      search: search.current,
      ordering: sortBy
    });
  }, [fetchAssignedUsers, search, sortBy, type])

  const handleUserDetailClick = useCallback(userId => () => setDetailMenu(userId), [])

  const handleHideDetailMenu = useCallback(() => setDetailMenu(false), [])

  const debouncedFetchUsers = debounce(q => {
    resetPage()
    search.current = typeof q === "undefined" ? search.current : q
    fetchAssignedUsers({
      role: type.toLowerCase(),
      page: 0,
      search: search.current,
      ordering: sortBy
    });
  }, 500)

  const handleSearchChange = useCallback(e => debouncedFetchUsers(e.target.value), [debouncedFetchUsers])

  const handleSortClick = useCallback(() => setSortMenu(true), [])

  const handleHideSortMenu = useCallback(() => setSortMenu(false), [])

  const handleSortMenuClick = useCallback(sortBy => e => {
    resetPage()
    setSortBy(sortBy)
    setSortMenu(false)

    fetchAssignedUsers({
      role: type.toLowerCase(),
      page: 0,
      search: search.current,
      ordering: sortBy
    });
  }, [type, fetchAssignedUsers, resetPage])

  const [showEditUserRoadmapModal, setShowEditUserRoadmapModal] = useState(false);

  const [editRoadmapUserId, setEditRoadmapUserId] = useState(null);

  const handleEditUserRoadmapClick = useCallback(userId => () => {
    setEditRoadmapUserId(userId);
    setShowEditUserRoadmapModal(true);
  }, []);

  const handleEditUserRoadmapModalHide = useCallback((saved) => {
    setShowEditUserRoadmapModal(false);
    setEditRoadmapUserId(null);
    if (typeof saved === "boolean" && saved) debouncedFetchUsers();
  }, [ debouncedFetchUsers ]);

  const renderContent = useCallback(({toggleShowRoadmaps} = {}) => {
    if (!assignedUsers) {
      return <Loader />
    } else if (assignedUsers.results.length === 0) {
      return <p className="no-data">No data</p>
    } else {
      return (
        <>
          {assignedUsers.results.map(u => (
            <UserCard
              key={u.id}
              user={u}
              onDetail={handleUserDetailClick(u.id)}
              toggleShowRoadmaps={toggleShowRoadmaps}
              canEditAssign={canEditAssign}
              handleEditUserRoadmapClick={handleEditUserRoadmapClick(u.id)}
            />
          ))}
          {fetchAssignedUsersPending && (
            <Loader />
          )}
        </>
      )
    }
  }, [fetchAssignedUsersPending, assignedUsers, handleUserDetailClick, canEditAssign, handleEditUserRoadmapClick])

  const actionMenuItems = useCallback(() => {
    const user = assignedUsers.results.find(u => u.id === detailMenu)

    const items = [
      { user },
      {
        to: {
          pathname: `/manage/user/${user.id}`,
          state: { backLink: location },
        },
        label: 'View Profile',
      },
    ]

    if (canEditAssign) {
      items.push({
        to: { 
          pathname: `/manage/user/${user.id}/edit-roadmap`,
          state: { backLink: location },
        },
        label: 'Edit Assigned Roadmaps',
      })
    }
    
    return items
  }, [assignedUsers, detailMenu, canEditAssign, location])

  const sortByOptions = [
    { label: 'First Name', field: 'first_name' },
    { label: 'Last Name', field: 'last_name' },
    { label: 'Most Progress', field: '-max_progress' },
    { label: replaceStringWithSynonyms('Most Red Assessments'), field: '-red_assessments_count' },
    { label: 'Last Login', field: '-last_seen' }
  ]

  return (
    <div className="dashboard-admin-page">
      <DesktopHeader>
        <Container>
          <div className="desktop-page-secondary-header-wrapper mrm-p-1">
            <AdminPageHeader
              type={type}
              replaceStringWithSynonyms={replaceStringWithSynonyms}
              assignedUsers={assignedUsers}
              handleSearchChange={handleSearchChange}
              sortByOptions={sortByOptions}
              sortByValue={sortBy}
              onSort={handleSortMenuClick}
            />
          </div>
        </Container>
      </DesktopHeader>
      <div className="d-lg-none mobile-page-container">
        <AdminPageHeader
          type={type}
          replaceStringWithSynonyms={replaceStringWithSynonyms}
          assignedUsers={assignedUsers}
          handleSearchChange={handleSearchChange}
          handleSortClick={handleSortClick}
        />
        {renderContent({toggleShowRoadmaps: true})}
        {assignedUsers && detailMenu && (
          <ActionMenu
            show={!!detailMenu}
            onHide={handleHideDetailMenu}
            items={actionMenuItems()}
          />
        )}
        <SortMenu
          show={!!sortMenu}
          onHide={handleHideSortMenu}
          onSort={handleSortMenuClick}
          value={sortBy}
          sortByOptions={sortByOptions}
        />
      </div>
      <div className="d-none d-lg-block desktop-page-container">
        <Container className="content-wrapper normal-width-container">
          {renderContent({toggleShowRoadmaps: false})}
        </Container>
        <EditUserRoadmapModal show={showEditUserRoadmapModal} onHide={handleEditUserRoadmapModalHide} userId={editRoadmapUserId} />
      </div>
    </div>
  );
};

AdminPage.propTypes = {};
AdminPage.defaultProps = {};
