const SelectExam = ({onSelect, onSubmit, exams, error, examsDone}) => {
    return (
        <main className="pa4 black-80">
            <div className="measure center">
                <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                <legend className="f4 fw6 ph0 mh0">Select Exam</legend>
                <div className="mt3">
                    <select className="pa2 input-reset ba bg-transparent w-100" type="text" name="exam"  id="exam" defaultValue="" onChange={onSelect} >
                        <option disabled value="">{"<--Select Exam-->"}</option>
                        {exams.map((exam, index) => {
                            return <option disabled={examsDone.includes(exam._id)} key={index} value={index}>{exam.name}</option>
                        })}
                    </select>
                </div>
                {error && <p>{error}</p>}
                </fieldset>
                <div className="">
                <button className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" onClick={onSubmit} >Start Exam</button>
                </div>
                <div className="lh-copy mt3">
                </div>
            </div>
        </main>
    )
}

export default SelectExam;