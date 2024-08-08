/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { UserService } from '@/demo/service/UserService';
import { Demo } from '@/types';
import { userIsAdmin } from '@/app/api/logic';
import { Paginator } from 'primereact/paginator';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let emptyUser: Demo.User = {
        id: 0,
        email: '',
        username: '',
        password: '',
        role: ''
    };

    const [users, setUsers] = useState(null);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [user, setUser] = useState<Demo.User>(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    // const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const rowsPerPage = 10;

    const onPageChange = (event) => {
        setCurrentPage(event.page);
    };

    useEffect(() => {
        if (!userIsAdmin()) {
            router.push('/');
        } else {
            UserService.getUsers(currentPage).then((data) => {
                setUsers(data.content as any);
                setTotalRecords(data.totalElements);
            });
            setLoading(true);
        }
    }, [currentPage]);

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    };

    const saveUser = () => {
        setSubmitted(true);

        if (user.username.trim() && user.email.trim()) {
            let _users = [...(users as any)];
            let _user = { ...user };
            if (user.id) {
                UserService.editUser(user).then((success) => {
                    if (success) {
                        const index = _users.findIndex((userToFind) => userToFind && userToFind.id === user.id);
                        _users[index] = _user;
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'User Updated',
                            life: 3000
                        });

                        setUsers(_users as any);
                        setUserDialog(false);
                        setUser(emptyUser);
                    }
                });
            } else {
                UserService.addUser(user).then((data) => {
                    _user.id = data.id;
                    _users.push(_user);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'User Created',
                        life: 3000
                    });

                    setUsers(_users as any);
                    setUserDialog(false);
                    setUser(emptyUser);
                });
            }
        }
    };

    const editUser = (user: Demo.User) => {
        setUser({ ...user });
        setUserDialog(true);
    };

    const confirmDeleteUser = (user: Demo.User) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const deleteUser = () => {
        UserService.deleteUser(user.id);
        let _users = (users as any)?.filter((val: any) => val.id !== user.id);
        setUsers(_users);
        setDeleteUserDialog(false);
        setUser(emptyUser);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'User Deleted',
            life: 3000
        });
    };

    const confirmDeleteSelected = () => {
        setDeleteUsersDialog(true);
    };

    const deleteSelectedUsers = () => {
        if (selectedUsers) {
            selectedUsers.forEach((user) => {
                UserService.deleteUser(user.id);
            });
        }
        let _users = (users as any)?.filter((val: any) => !(selectedUsers as any)?.includes(val));
        setUsers(_users);
        setDeleteUsersDialog(false);
        setSelectedUsers(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Users Deleted',
            life: 3000
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, data: string) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user[`${data}`] = val;
        setUser(_user);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !(selectedUsers as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Demo.User) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const roles = {
        USER: 'USER',
        ADMIN: 'ADMIN'
    };

    const roleOptions = Object.keys(roles).map((key) => ({
        label: roles[key],
        value: key
    }));

    const usernameBodyTemplate = (rowData: Demo.User) => {
        return (
            <>
                <span className="p-column-title">Username</span>
                {rowData.username}
            </>
        );
    };

    const emailBodyTemplate = (rowData: Demo.User) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };

    const roleBodyTemplate = (rowData: Demo.User) => {
        return (
            <>
                <span className="p-column-title">Role</span>
                {rowData.role}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Demo.User) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUser(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Users</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                {/* <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." /> */}
            </span>
        </div>
    );

    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveUser} />
        </>
    );
    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteUser} />
        </>
    );
    const deleteUsersDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUsersDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedUsers} />
        </>
    );

    return (
        <div className="grid crud-demo">
            {isLoading && (
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} />
                        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                        <DataTable
                            ref={dt}
                            value={users}
                            selection={selectedUsers}
                            onSelectionChange={(e) => setSelectedUsers(e.value as any)}
                            dataKey="id"
                            rows={10}
                            className="datatable-responsive"
                            emptyMessage="No users found."
                            header={header}
                            responsiveLayout="scroll"
                        >
                            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                            <Column field="id" header="Id" body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }} sortable></Column>
                            <Column field="email" header="Email" body={emailBodyTemplate} headerStyle={{ minWidth: '15rem' }} sortable filter></Column>
                            <Column field="username" header="Username" body={usernameBodyTemplate} headerStyle={{ minWidth: '15rem' }} sortable filter></Column>
                            <Column field="role" header="Role" body={roleBodyTemplate} headerStyle={{ minWidth: '15rem' }} sortable filter></Column>
                            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>
                        <Paginator first={currentPage * rowsPerPage} rows={rowsPerPage} totalRecords={totalRecords} onPageChange={onPageChange} />

                        <Dialog visible={userDialog} style={{ width: '450px' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <InputText
                                    id="email"
                                    value={user.email}
                                    onChange={(e) => onInputChange(e, 'email')}
                                    required
                                    autoFocus
                                    className={classNames({
                                        'p-invalid': submitted && !user.email
                                    })}
                                />
                                {submitted && !user.email && <small className="p-invalid">Email is required.</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="username">Username</label>
                                <InputText
                                    id="username"
                                    value={user.username}
                                    onChange={(e) => onInputChange(e, 'username')}
                                    required
                                    autoFocus
                                    className={classNames({
                                        'p-invalid': submitted && !user.username
                                    })}
                                />
                                {submitted && !user.username && <small className="p-invalid">Username is required.</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="email">Role</label>
                                <Dropdown id="role" value={user.role} options={roleOptions} onChange={(e) => onInputChange(e, 'role')} placeholder="Select a user role" />
                                {submitted && !user.role && <small className="p-invalid">Role is required.</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="password">Password</label>
                                <Password id="password" onChange={(e) => onInputChange(e, 'password')} required autoFocus toggleMask />
                            </div>
                        </Dialog>

                        <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                {user && (
                                    <span>
                                        Are you sure you want to delete <b>{user.id}</b>?
                                    </span>
                                )}
                            </div>
                        </Dialog>

                        <Dialog visible={deleteUsersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                {user && <span>Are you sure you want to delete the selected users?</span>}
                            </div>
                        </Dialog>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Crud;
