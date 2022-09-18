import React, { useMemo, useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';

import { Link, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import dayjs from 'dayjs'
import capitalize from 'lodash/capitalize';
import { Header, SearchBar, CustomTable, Loader, ActionMenu, DesktopHeader } from '../common';
import usePagination from '../common/usePagination';
import { useUnauthorizedErrorHandler } from '../../common/apiHelpers';
import { useFetchUserAccounts } from './redux/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/pro-regular-svg-icons';



export default function AccountsPage() {
  const [ searchText, setSearchText ] = useState('');
  const [ sortBy, setSortBy ] = useState(null);
  const { accounts, fetchUserAccounts, fetchUserAccountsPending } = useFetchUserAccounts();
  const [ actionMenu, setActionMenu ] = useState(null)
  const location = useLocation()
  const columns = [
    {
      title: 'Name',
      id: 'name',
      sortable: true
    },
    {
      title: 'Email',
      id: 'email',
      sortable: true
    },
    {
      title: '',
      id: 'action',
      className: 'text-center',
      cell: row => (
        <Button className="btn-action btn-edit" onClick={handleActionMenuClick(row.id)}>
          <FontAwesomeIcon icon={faEllipsisH} />
        </Button>
      ),
    }
  ]


  const desktopColumns = [
    {
      title: 'Name',
      id: 'name',
      sortable: true,
      cell: row => (
        <>
        <b>{row.name}</b>
        <p>{row.email}</p>
        </>
      ),
    },
    {
      title: 'Role',
      id: 'role',
      sortable: true, 
      cell: row => (
        <p>{row.groups}</p>
      ),
    },
    {
      title: 'Group',
      id: 'group',
      sortable: true, 
      cell: row => (
        <p>{row.cohort}</p>
      ),
    },
    {
      title: 'Active',
      id: 'active',
      sortable: true, 
      cell: row => (
        <p>{row.approved}</p>
      ),
    },
    {
      title: 'Coach',
      id: 'coaches',
      sortable: true, 
      cell: row => (
        <p>{row.coaches}</p>
      ),
    },
    {
      title: 'Roadmaps',
      id: 'roadmaps',
      sortable: true, 
      cell: row => (
        <p>{row.roadmaps}</p>
      ),
    },
    {
      title: '',
      id: 'action',
      className: 'text-center',
      cell: row => (
        <Link className="more-btn-desktop float-right" onClick={handleActionMenuClick(row.id)}>
          <FontAwesomeIcon icon={faEllipsisH} />
        </Link>
      ),
    }
  ]

  const handleActionMenuClick = useCallback((userId) => () => {
    setActionMenu(userId)
  }, [])

  const handleHideActionMenu = useCallback(() => setActionMenu(null), [])

  const unauthorizedErrorHandler = useUnauthorizedErrorHandler();
  const { resetPage } = usePagination({
    fetchAction: fetchUserAccounts,
    actionArgs: {
      search: searchText,
      sortBy
    },
    requestNextPage: () => accounts && accounts.next && !fetchUserAccountsPending
  })

  useEffect(() => {
    fetchUserAccounts({ page: 0 }).catch(unauthorizedErrorHandler);
  }, [fetchUserAccounts, unauthorizedErrorHandler])

  const tableData = useMemo(() => {
    if (!accounts) {
      return [];
    }
    return accounts.results.map(acc => ({
      id: acc.id,
      name: `${capitalize(acc.first_name)} ${capitalize(acc.last_name)}`,
      email: acc.email,
      last_login: acc.last_login ? dayjs(acc.last_seen).fromNow() : "Never",
      groups: acc.groups.join(', '),
      approved: acc.is_approved === true ? 'Active' : 'Inactive',
      cohort: acc.cohort.map(x => x.text).join(', '),
      coaches: acc.coach.map(c => `${c.first_name} ${c.last_name}`).join(', '),
      roadmaps: acc.roadmaps_info.map(r => `${r.title}`).join(', '),
    }))
  }, [accounts])

  const debouncedSearch = useCallback(
    debounce(q => {
      resetPage();
      fetchUserAccounts({ search: q, page: 0, sortBy });
    }, 500),
    [fetchUserAccounts]
  );

  const handleAccountSearch = useCallback(e => {
    setSearchText(e.target.value);
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);

  const getSortByKey = useCallback(field => {
    if (field === 'name') {
      return 'first_name,last_name'
    } else if (field === '-name') {
      return '-first_name,-last_name'
    } else {
      return field
    }
  }, [])

  const handleSortChange = useCallback(field => {
    const newSortBy = getSortByKey(field)
    setSortBy(newSortBy)
    resetPage();
    fetchUserAccounts({
      search: searchText,
      page: 0,
      sortBy: newSortBy
    })
  }, [
    searchText,
    resetPage,
    getSortByKey,
    setSortBy,
    fetchUserAccounts
  ]);

  const actionMenuItems = useCallback(() => {
    const items = [];

    if (accounts) {
      const user = accounts.results.find(u => u.id === actionMenu);
      items.push({user});
    }

    items.push(
      {
        to: {
          pathname:`/manage/user/${actionMenu}`,
          state: { backLink: location }
        },
        label: 'View Account',
      },
      {
        to: {
          pathname: `/manage/user/${actionMenu}/edit-profile`,
          state: { backLink: location }
        },
        label: 'Edit Account',
      }
    );

    return items;
  }, [
    actionMenu, 
    accounts,
    location
  ])

  return (
    <div className="manage-accounts-page">
      <Header
        border
        icon="back"
        title="Accounts"
        defaultBackLink="/user"
      />
      <DesktopHeader>
        <Container>
          <div className="desktop-page-secondary-header-wrapper card mrm-mb-1 mrm-p-1">
            <h1>Accounts ({accounts && (accounts.count)})</h1>
            <div className="d-flex justify-content-between">
              <SearchBar
                value={searchText}
                onSearch={handleAccountSearch}
              />
              <Link to="/manage/user/add-profile">
                <Button variant="primary">Add Account</Button>
              </Link>
            </div>
          </div>
        </Container>
      </DesktopHeader>
      <div className="d-lg-none mobile-page-container">
        <div className="mrm-mt-1 mrm-px-0_5 d-flex justify-content-between d-lg-none">
          <SearchBar
            value={searchText}
            onSearch={handleAccountSearch}
          />
          <Link to="/manage/user/add-profile">
            <Button variant="primary">Add Account</Button>
          </Link>
        </div>
        <div className="mrm-mt-1 mrm-mb-3">
          <CustomTable columns={columns} data={tableData} onSortChange={handleSortChange} />
        </div>
      </div>
      <div className="d-none d-lg-block desktop-page-container">
        <Container>
          <div className="mrm-mt-1 mrm-mb-3">
            <CustomTable columns={desktopColumns} data={tableData} onSortChange={handleSortChange} />
          </div>
        </Container>
      </div>
      {fetchUserAccountsPending && (
        <Loader />
      )}
      <ActionMenu
        show={!!actionMenu}
        onHide={handleHideActionMenu}
        items={actionMenuItems()}
      />
    </div>
  );
};

AccountsPage.propTypes = {};
AccountsPage.defaultProps = {};
