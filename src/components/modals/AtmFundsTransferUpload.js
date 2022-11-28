const { FileSelect, Header, GrayCircleAvatar, Select, Button, Hr } = require("../../custom");

export function RenderAtmFundsTranferUploader(props) {
    return (
        <>
            <section className="py-3 d-flex align-items-center justify-content-between px-3">
                <h2
                    style={{ color: "#EAAA00", fontSize: 20, fontWeight: "bold" }}
                >
                    {props.modalTitle}
                </h2>
                <GrayCircleAvatar onClick={() => props.closeModal(props.modalName)}>
                    X
                </GrayCircleAvatar>
                </section>
                <Hr />
                <form className="container py-3" ref={props.formRef} onSubmit={props.onSubmit}>
                <div className="row">
                    <div className="col-md-12">
                    <Header
                        style={{ marginTop: 8, fontSize: 14, marginBottom: 4 }}
                    >
                        {props.modalContent}
                    </Header>
                    <Select
                        value={props.selectedItem}
                        onChange={(e) => props.setItemType(e.target.value)}
                    >
                        {
                            props.options?.map(option => <option value={option.value}>{option.text}</option>)
                        }

                    </Select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                    <Header>Upload File</Header>
                    <FileSelect onClick={props.onBrowseFile}>Browse files</FileSelect>
                    <span
                        className="pt-2"
                        style={{ fontWeight: 500, fontSize: 14 }}
                    >
                        {console.log(props.file)}
                        {props.file && props.file.name}
                    </span>
                    <input
                        accept=".xlsx"
                        id="atm-file-uploader"
                        type="file"
                        style={{ display: "none" }}
                        onChange={props.fileSelected}
                    />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                    <Header style={{ fontSize: 10, marginTop: 4 }}>
                        Allows only Excel files(xlsx)
                    </Header>
                    </div>
                </div>
                <div className="row py-2">
                    <table
                    id="result"
                    className="table table-striped display responsive nowrap w-100 table-bordered"
                    ></table>
                </div>
                <div className="row py-2 mt-4">
                    <div className="col-md-6">
                    <Button style={{ width: 170 }}>Upload</Button>
                    </div>
                    <div className="col-mdd-6">
                    </div>
                </div>
            </form>
        </>
    );
}