/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { FortuneService } from '../../../../demo/service/FortuneService';
import { Demo } from '@/types';
import { userIsAdmin } from '@/app/api/logic';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let emptyFortune: Demo.Fortune = {
        id: 0,
        sentence: '',
        neededWords: []
    };

    const wordType = {
        NOUN: 'Noun',
        NOUN_PLURAL: 'Noun plural',
        VERB: 'Verb',
        ADJECTIVE: 'Adjective'
    };

    const [currentPage, setCurrentPage] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [fortunes, setFortunes] = useState(null);
    const [fortuneDialog, setFortuneDialog] = useState(false);
    const [neededWordCount, setNeededWordCount] = useState();
    const [deleteFortuneDialog, setDeleteFortuneDialog] = useState(false);
    const [deleteFortunesDialog, setDeleteFortunesDialog] = useState(false);
    const [fortune, setFortune] = useState<Demo.Fortune>(emptyFortune);
    const [selectedFortunes, setSelectedFortunes] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const [isLoading, setLoading] = useState(false);
    const router = useRouter();
    const rowsPerPage = 10;

    const openNew = () => {
        setFortune(emptyFortune);
        setNeededWordCount(emptyFortune.neededWords?.length);
        setSubmitted(false);
        setFortuneDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setFortuneDialog(false);
    };

    const hideDeleteFortuneDialog = () => {
        setDeleteFortuneDialog(false);
    };

    const hideDeleteFortunesDialog = () => {
        setDeleteFortunesDialog(false);
    };

    const saveFortune = () => {
        setSubmitted(true);

        if (fortune.sentence.trim()) {
            let _fortunes = [...(fortunes as any)];
            let _fortune = { ...fortune };
            if (fortune.id) {
                FortuneService.editFortune(fortune).then((success) => {
                    if (success) {
                        const index = _fortunes.findIndex((fortuneToFind) => fortuneToFind && fortuneToFind.id === fortune.id);
                        _fortunes[index] = _fortune;
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Fortune Updated',
                            life: 3000
                        });

                        setFortunes(_fortunes as any);
                        setFortuneDialog(false);
                        setFortune(emptyFortune);
                    }
                });
            } else {
                FortuneService.addFortune(fortune).then((data) => {
                    _fortune.id = data.id;
                    _fortunes.push(_fortune);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Fortune Created',
                        life: 3000
                    });

                    setFortunes(_fortunes as any);
                    setFortuneDialog(false);
                    setFortune(emptyFortune);
                });
            }
        }
    };

    const editFortune = (fortune: Demo.Fortune) => {
        setFortune({ ...fortune });
        setNeededWordCount(fortune.neededWords?.length);
        setFortuneDialog(true);
    };

    const confirmDeleteFortune = (fortune: Demo.Fortune) => {
        setFortune(fortune);
        setDeleteFortuneDialog(true);
    };

    const deleteFortune = () => {
        FortuneService.deleteFortune(fortune.id);
        let _fortunes = (fortunes as any)?.filter((val: any) => val.id !== fortune.id);
        setFortunes(_fortunes);
        setDeleteFortuneDialog(false);
        setFortune(emptyFortune);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Fortune Deleted',
            life: 3000
        });
    };

    const confirmDeleteSelected = () => {
        setDeleteFortunesDialog(true);
    };

    const deleteSelectedFortunes = () => {
        if (selectedFortunes) {
            selectedFortunes.forEach((fortune) => {
                FortuneService.deleteFortune(fortune.id);
            });
        }
        let _fortunes = (fortunes as any)?.filter((val: any) => !(selectedFortunes as any)?.includes(val));
        setFortunes(_fortunes);
        setDeleteFortunesDialog(false);
        setSelectedFortunes(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Fortunes Deleted',
            life: 3000
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, sentence: string) => {
        const val = (e.target && e.target.value) || '';
        let _fortune = { ...fortune };
        _fortune[`${sentence}`] = val;
        setFortune(_fortune);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedFortunes || !(selectedFortunes as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Demo.Fortune) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const sentenceBodyTemplate = (rowData: Demo.Fortune) => {
        return (
            <>
                <span className="p-column-title">Sentence</span>
                {rowData.sentence}
            </>
        );
    };

    const neededWordsBodyTemplate = (rowData: Demo.Fortune) => {
        return (
            <>
                <span className="p-column-title">NeededWords</span>
                {rowData.neededWords &&
                    rowData.neededWords.map((wordObj) => (
                        <span key={wordObj.id}>
                            {wordObj.descriptor} ({wordObj.wordType})
                            <br />
                        </span>
                    ))}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Demo.Fortune) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editFortune(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteFortune(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Fortunes</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left"></span>
        </div>
    );

    const fortuneDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveFortune} />
        </>
    );
    const deleteFortuneDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteFortuneDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteFortune} />
        </>
    );
    const deleteFortunesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteFortunesDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedFortunes} />
        </>
    );

    const addNeededWord = () => {
        setNeededWordCount(neededWordCount + 1);
    };

    const wordTypeOptions = Object.keys(wordType).map((key) => ({
        label: wordType[key],
        value: key
    }));

    const onWordTypeChange = (e, index) => {
        const newNeededWords = [...fortune.neededWords];
        newNeededWords[index] = { ...newNeededWords[index], wordType: e.value };
        setFortune({ ...fortune, neededWords: newNeededWords });
    };

    const onNeededWordChange = (e, index) => {
        const newNeededWords = [...fortune.neededWords];
        newNeededWords[index] = { ...newNeededWords[index], descriptor: e.target.value };
        setFortune({ ...fortune, neededWords: newNeededWords });
    };

    const deleteNeededWord = (e, index) => {
        const newNeededWords = fortune.neededWords.filter((_, i) => i !== index);
        setFortune({ ...fortune, neededWords: newNeededWords });
        setNeededWordCount(newNeededWords.length);
    };

    useEffect(() => {
        if (!userIsAdmin()) {
            router.push('/');
        } else {
            setLoading(true);
            FortuneService.getFortunes(currentPage).then((data) => {
                setFortunes(data.content);
                setTotalRecords(data.totalElements);
            });
        }
    }, [currentPage]);

    const onPageChange = (event) => {
        setCurrentPage(event.page);
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
                            value={fortunes}
                            selection={selectedFortunes}
                            onSelectionChange={(e) => setSelectedFortunes(e.value)}
                            dataKey="id"
                            className="datatable-responsive"
                            emptyMessage="No fortunes found."
                            header="Fortune List"
                            responsiveLayout="scroll"
                        >
                            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                            <Column field="id" header="Id" body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }} sortable></Column>
                            <Column field="sentence" header="Sentence" body={sentenceBodyTemplate} headerStyle={{ minWidth: '15rem' }} sortable filter></Column>
                            <Column field="needed-words" header="Needed words" body={neededWordsBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>
                        <Paginator first={currentPage * rowsPerPage} rows={rowsPerPage} totalRecords={totalRecords} onPageChange={onPageChange} />
                        <Dialog visible={fortuneDialog} style={{ width: '450px' }} header="Fortune Details" modal className="p-fluid" footer={fortuneDialogFooter} onHide={hideDialog}>
                            <div className="field">
                                <label htmlFor="sentence">Sentence</label>
                                <InputText
                                    id="sentence"
                                    value={fortune.sentence}
                                    onChange={(e) => onInputChange(e, 'sentence')}
                                    required
                                    autoFocus
                                    className={classNames({
                                        'p-invalid': submitted && !fortune.sentence
                                    })}
                                />
                                {submitted && !fortune.sentence && <small className="p-invalid">Sentence is required.</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="neededWords">Needed Words</label>
                                {Array.from({ length: neededWordCount }).map((_, index) => (
                                    <div key={index} className="field-container">
                                        <InputText
                                            id={`neededWords-${index}`}
                                            className={classNames({
                                                'p-invalid': submitted && !fortune.neededWords[index]?.descriptor
                                            })}
                                            required
                                            value={fortune.neededWords[index]?.descriptor || ''}
                                            onChange={(e) => onNeededWordChange(e, index)}
                                            placeholder="Write a description"
                                        />
                                        <Dropdown id={`wordType-${index}`} value={fortune.neededWords[index]?.wordType || ''} options={wordTypeOptions} onChange={(e) => onWordTypeChange(e, index)} placeholder="Select a word type" />
                                        <Button icon="pi pi-minus" severity="warning" className="mr-2" onClick={(e) => deleteNeededWord(e, index)} />
                                        {submitted && !fortune.neededWords[index]?.descriptor && <small className="p-invalid-small">Sentence is required.</small>}
                                    </div>
                                ))}
                            </div>

                            <Button icon="pi pi-plus" rounded severity="success" className="mr-2" onClick={() => addNeededWord()} />
                        </Dialog>

                        <Dialog visible={deleteFortuneDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteFortuneDialogFooter} onHide={hideDeleteFortuneDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                {fortune && (
                                    <span>
                                        Are you sure you want to delete <b>{fortune.id}</b>?
                                    </span>
                                )}
                            </div>
                        </Dialog>

                        <Dialog visible={deleteFortunesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteFortunesDialogFooter} onHide={hideDeleteFortunesDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                {fortune && <span>Are you sure you want to delete the selected fortunes?</span>}
                            </div>
                        </Dialog>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Crud;
