/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Paginator } from 'primereact/paginator';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { WordService } from '../../../../demo/service/WordService';
import { Demo } from '@/types';
import { userIsAdmin } from '@/app/api/logic';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let emptyWord: Demo.Word = {
        personal: false,
        id: 0,
        text: '',
        wordType: ''
    };

    const wordType = {
        NOUN: 'Noun',
        NOUN_PLURAL: 'Noun plural',
        VERB: 'Verb',
        ADJECTIVE: 'Adjective'
    };

    const [currentPage, setCurrentPage] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const rowsPerPage = 10;
    const [words, setWords] = useState(null);
    const [wordDialog, setWordDialog] = useState(false);
    const [deleteWordDialog, setDeleteWordDialog] = useState(false);
    const [deleteWordsDialog, setDeleteWordsDialog] = useState(false);
    const [word, setWord] = useState<Demo.Word>(emptyWord);
    const [selectedWords, setSelectedWords] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!userIsAdmin()) {
            router.push('/');
        } else {
            setLoading(true);
            WordService.getWords(currentPage).then((data) => {
                setWords(data.content);
                setTotalRecords(data.totalElements);
            });
        }
    }, [currentPage]);

    const onPageChange = (event) => {
        setCurrentPage(event.page);
    };

    const openNew = () => {
        setWord(emptyWord);
        setSubmitted(false);
        setWordDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setWordDialog(false);
    };

    const hideDeleteWordDialog = () => {
        setDeleteWordDialog(false);
    };

    const hideDeleteWordsDialog = () => {
        setDeleteWordsDialog(false);
    };

    const saveWord = () => {
        setSubmitted(true);

        if (word.text.trim()) {
            let _words = [...(words as any)];
            let _word = { ...word };
            if (word.id) {
                WordService.editWord(word).then((success) => {
                    if (success) {
                        const index = _words.findIndex((wordToFind) => wordToFind && wordToFind.id === word.id);
                        _words[index] = _word;
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Word Updated',
                            life: 3000
                        });

                        setWords(_words as any);
                        setWordDialog(false);
                        setWord(emptyWord);
                    }
                });
            } else {
                WordService.addWord(word).then((data) => {
                    _word.id = data.id;
                    _words.push(_word);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Word Created',
                        life: 3000
                    });

                    setWords(_words as any);
                    setWordDialog(false);
                    setWord(emptyWord);
                });
            }
        }
    };

    const editWord = (word: Demo.Word) => {
        setWord({ ...word });
        setWordDialog(true);
    };

    const confirmDeleteWord = (word: Demo.Word) => {
        setWord(word);
        setDeleteWordDialog(true);
    };

    const deleteWord = () => {
        WordService.deleteWord(word.id);
        let _words = (words as any)?.filter((val: any) => val.id !== word.id);
        setWords(_words);
        setDeleteWordDialog(false);
        setWord(emptyWord);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Word Deleted',
            life: 3000
        });
    };

    const confirmDeleteSelected = () => {
        setDeleteWordsDialog(true);
    };

    const deleteSelectedWords = () => {
        if (selectedWords) {
            selectedWords.forEach((word) => {
                WordService.deleteWord(word.id);
            });
        }
        let _words = (words as any)?.filter((val: any) => !(selectedWords as any)?.includes(val));
        setWords(_words);
        setDeleteWordsDialog(false);
        setSelectedWords(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Words Deleted',
            life: 3000
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, text: string) => {
        const val = (e.target && e.target.value) || '';
        let _word = { ...word };
        _word[`${text}`] = val;
        setWord(_word);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedWords || !(selectedWords as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Demo.Word) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const wordBodyTemplate = (rowData: Demo.Word) => {
        return (
            <>
                <span className="p-column-title">Word</span>
                {rowData.text}
            </>
        );
    };

    const typeBodyTemplate = (rowData: Demo.Word) => {
        return (
            <>
                <span className="p-column-title">Type</span>
                {rowData.wordType}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Demo.Word) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editWord(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteWord(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Words</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left"></span>
        </div>
    );

    const wordDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveWord} />
        </>
    );
    const deleteWordDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteWordDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteWord} />
        </>
    );
    const deleteWordsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteWordsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedWords} />
        </>
    );

    const wordTypeOptions = Object.keys(wordType).map((key) => ({
        label: wordType[key],
        value: key
    }));

    const onWordTypeChange = (e) => {
        const selectedWordType = e.value;
        setWord({ ...word, wordType: selectedWordType });
    };

    return (
        <div className="grid crud-demo">
            {isLoading && (
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} />
                        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                        <DataTable
                            ref={dt}
                            value={words}
                            selection={selectedWords}
                            onSelectionChange={(e) => setSelectedWords(e.value as any)}
                            dataKey="id"
                            className="datatable-responsive"
                            emptyMessage="No words found."
                            header={header}
                            responsiveLayout="scroll"
                        >
                            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                            <Column field="id" header="Id" body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }} sortable></Column>
                            <Column field="text" header="Word" body={wordBodyTemplate} headerStyle={{ minWidth: '15rem' }} sortable filter></Column>
                            <Column field="wordType" header="Type" body={typeBodyTemplate} headerStyle={{ minWidth: '15rem' }} sortable filter></Column>
                            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>
                        <Paginator first={currentPage * rowsPerPage} rows={rowsPerPage} totalRecords={totalRecords} onPageChange={onPageChange} />

                        <Dialog visible={wordDialog} style={{ width: '450px' }} header="Word Details" modal className="p-fluid" footer={wordDialogFooter} onHide={hideDialog}>
                            <div className="field">
                                <label htmlFor="text">Word</label>
                                <InputText
                                    id="text"
                                    value={word.text}
                                    onChange={(e) => onInputChange(e, 'text')}
                                    required
                                    autoFocus
                                    className={classNames({
                                        'p-invalid': submitted && !word.text
                                    })}
                                />
                                {submitted && !word.text && <small className="p-invalid">Word is required.</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="wordType">Type</label>
                                <Dropdown value={word.wordType || ''} options={wordTypeOptions} onChange={(e) => onWordTypeChange(e)} placeholder="Select a word type" />
                                {submitted && !word.text && <small className="p-invalid">Type is required.</small>}
                            </div>
                        </Dialog>

                        <Dialog visible={deleteWordDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteWordDialogFooter} onHide={hideDeleteWordDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                {word && (
                                    <span>
                                        Are you sure you want to delete <b>{word.id}</b>?
                                    </span>
                                )}
                            </div>
                        </Dialog>

                        <Dialog visible={deleteWordsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteWordsDialogFooter} onHide={hideDeleteWordsDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                {word && <span>Are you sure you want to delete the selected words?</span>}
                            </div>
                        </Dialog>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Crud;
