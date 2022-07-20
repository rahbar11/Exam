import { Component } from "react";

class MainExam extends Component {
    constructor(props) {
        super();
        this.state = {
            selected: 0,
            input: "",
            types : [],
            popup: false,
            currentTime: Date.now()
        }
    }

    loadQuestion = (questionIndex) => {
      if (questionIndex >= this.props.questions.length) {
         alert('Please review your answers and click on "Exam Finish" button to submit!')
      } else {
         const input = this.props.questions[questionIndex].input
         if (input) {
             this.setState({selected: questionIndex, input})
         } else {
             this.setState({selected: questionIndex, input: ""})
         };
         localStorage.setItem("selected", `${questionIndex}`)
      }
    }

    saveInput = (event) => {
         const {questions} = this.props
         const {selected, input} = this.state;
         questions[selected].input = input;
         const updatedJSON = JSON.stringify(questions);
         localStorage.setItem("questions", updatedJSON);
    }

    selectionType = (type) => {
      const {questions} = this.props;
      const {selected} = this.state;
      this.saveType(type, selected);
      questions[selected].type = type;
      const updatedJSON = JSON.stringify(questions);
      localStorage.setItem("questions", updatedJSON)
    }

    resetInput = () => {
        const {questions} = this.props
        const {selected} = this.state;
        questions[selected].input = "";
        questions[selected].type = "";
        this.saveType("", selected);
        const updatedJSON = JSON.stringify(questions);
        localStorage.setItem("questions", updatedJSON);
        this.loadQuestion(selected)
    }

    saveType = (type, questionIndex) => {
      const {types} = this.state;
      types.splice(questionIndex, 1, type);
      this.setState({types});
    }

    getTypes = () => {
      this.props.questions.forEach((question, index) => {
         this.saveType(question.type, index);
      });
    };

    getColor = (questionIndex) => {
      const type = this.state.types[questionIndex];
      const input = this.props.questions[questionIndex].input;
      if (this.state.selected === questionIndex) {
         return "btn-blue"
      } else {
         if (type === "save") {
            if (input) {
               return "btn-success"
            } else {
               return "btn-danger"
            }
         } else if (type === "mark") {
            return "btn-orange"
         } else if (this.state.selected === questionIndex) {
            return "btn-blue"
         } else {
            return "btn-light"
         }
      } 
    }

    getTime = (time) => {
      const endingTime =  this.props.startingTime + 3600000
      const {currentTime} = this.state;
      if (currentTime < endingTime) {
         const remainingTime = endingTime - currentTime;
         if (time === "h") {
            const hours = Math.floor(remainingTime / (1000 * 60 * 60));
            return hours
         } else if (time === "m") {
            const remainingMinutes = remainingTime % (1000 * 60 * 60);
            const minutes = Math.floor(remainingMinutes / (1000 * 60));
            return minutes
         } else if (time === "s") {
            const remainingSeconds = remainingTime % (1000 * 60);
            const seconds = Math.floor(remainingSeconds / 1000);
            return seconds
         }
      } else {
         this.props.confirmFinish(true)
      }
    }

    showModal = (id) => {
      const modal = document.getElementById(id);
      this.setState({popup: true})
      modal.classList.add("show");
      modal.style = "display: block;";
      if (id === "exam_finish") {
         const table = document.getElementById("questionTable");
         const abcd = ["A", "B", "C", "D"]
         let mytable = "<tr>\n";
         this.props.questions.forEach((question, index) => {
            let input;
            let color;
            if (question.input) {
               input = abcd[question.input];
               color = "bg-green"
            } else {
               input = ""
               color = "bg-primary"
            }
            mytable += `<td><strong class="fs-14">${index + 1}</strong></td>
            <td> <span class="${color} fs-13 h-25px w-25px d-flex align-items-center justify-content-center rounded-pill mx-auto">${input}</span></td>`; 
            if (Math.round((index + 1) % 5) === 0) {
               mytable += `</tr>\n<tr>\n`; 
            }
         })
         mytable += "</tr>\n";
         table.innerHTML = mytable;
         console.log(mytable)
      }
    }

    hideModal = (id,event) => {
      if (!event || event.target.id === id) {
         const modal = document.getElementById(id);
         this.setState({popup: false})
         modal.classList.remove("show");
         modal.style = ""
      }
    }

    componentDidMount() {
        const selected = Number(localStorage.getItem("selected"));
        if (selected) {
            this.loadQuestion(selected);
        } else {
            this.loadQuestion(0)
        }
        this.getTypes();
        setInterval(() => {
            this.setState({
               currentTime: new Date().getTime()
            })
        }, 1000)
    }

    render() {
        const {loadQuestion, saveInput, selectionType, resetInput, getColor, getTime, showModal, hideModal} = this
        const {questions, currentExam, onFinish} = this.props;
        const {input, selected, currentTime, popup} = this.state;
        const date = new Date(currentTime);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return (
            <div id="modal">      
               <div className="container-fluid">
                  <div className="row">
                     <div className="col-12 text-header h-80px shadow">
                           <div className="row h-100 align-items-center">
                              <div className="col-12">
                                 <div className="row align-items-center">
                                    <div className="col-auto">
                                          <div className="row">
                                             <div className="col">
                                             </div>
                                          </div>
                                    </div>
                                    <div className="col">
                                          <div className="row">
                                             <div className="col text-center font-weight-bold text-gray text-uppercase">{currentExam.name} Exam</div>
                                          </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                     </div>
                     <div className="col-12 test-body">
                           <div className="row h-100">
                              <div className="col-12 h-100">
                                 <div className="row h-100">
                                 <div className="col test-body-left py-3 h-100">
                                       <div className="row mx-0 h-100 shadow rounded-10 border overflow-hidden d-block">
                                          <div className="col-12 test-inner-header h-40px border-bottom bg-light">
                                             <div className="row h-100 align-items-center">
                                             <div className="col font-weight-bold fs-17">Question {selected + 1}</div>
                                             <div className="col-auto font-weight-bold fs-15">
                                                   <div className="row font-weight-bold">
                                                      <div className="col-auto pr-1"><span className="text-gray">Correct Marks: </span><span className="text-success"> 4.00</span></div>
                                                      <div className="col-autotext-gray px-0">,</div>
                                                      <div className="col-auto pl-1"><span className="text-gray">Negative Marks: </span><span className="text-danger"> 1.00</span></div>
                                                   </div>
                                             </div>
                                             </div>
                                          </div>
                                          <div className="col-12 test-inner-body overflow-auto">
                                             <div className="row">
                                             <div className="col-12">
                                                   <div className="row">
                                                      <div className="col-12 fs-15 py-3 border-bottom font-weight-500 text-gray question-box">{questions[selected].question}</div>
                                                   </div>
                                             </div>
                                             <div className="col-12 py-3">
                                                   <div className="row">
                                                      <div className="col-12">
                                                         <div className="custom-control custom-radio mb-2">
                                                         <input type="radio" id="customRadio1" name="customRadio" className="custom-control-input" onChange={(event) => {this.setState({input: event.target.value})}} value="0" checked={input === "0"}  />
                                                         <label className="custom-control-label fs-14 h-25px d-inline-flex align-items-center" htmlFor="customRadio1"><span className="mr-2 font-weight-bold">A.</span> {questions[selected].options[0]}</label>
                                                         </div>
                                                         <div className="custom-control custom-radio mb-2">
                                                         <input type="radio" id="customRadio2" name="customRadio" className="custom-control-input" onChange={(event) => {this.setState({input: event.target.value})}} value="1" checked={input === "1"} />
                                                         <label className="custom-control-label fs-14 h-25px d-inline-flex align-items-center" htmlFor="customRadio2"><span className="mr-2 font-weight-bold">B.</span>{questions[selected].options[1]}</label>
                                                         </div>
                                                         <div className="custom-control custom-radio mb-2">
                                                         <input type="radio" id="customRadio3" name="customRadio" className="custom-control-input" onChange={(event) => {this.setState({input: event.target.value})}} value="2" checked={input === "2"} />
                                                         <label className="custom-control-label fs-14 h-25px d-inline-flex align-items-center" htmlFor="customRadio3"><span className="mr-2 font-weight-bold">C.</span> {questions[selected].options[2]}</label>
                                                         </div>
                                                         <div className="custom-control custom-radio mb-2">
                                                         <input type="radio" id="customRadio4" name="customRadio" className="custom-control-input" onChange={(event) => {this.setState({input: event.target.value})}} value="3" checked={input === "3"} />
                                                         <label className="custom-control-label fs-14 h-25px d-inline-flex align-items-center" htmlFor="customRadio4"><span className="mr-2 font-weight-bold">D.</span>{questions[selected].options[3]}</label>
                                                         </div>
                                                      </div>
                                                   </div>
                                             </div>
                                             </div>
                                          </div>
                                          <div className="col-12 test-inner-footer">
                                             <div className="row justify-content-between">
                                             <div className="col-6">
                                                   <div className="row">
                                                      <div className="col-auto">
                                                         <button type="button" className="btn btn-orange d-inline-flex justify-content-center align-items-center py-0 px-2 border text-capitalize fs-14 h-35px" onClick={() => {selectionType("mark"); saveInput(); loadQuestion(selected+1)}} > <i className="far fa-dot-circle"></i> <span className="ml-1">Mark for Review & Next</span></button>
                                                      </div>
                                                      <div className="col-auto pl-0">
                                                         <button className="btn btn-danger d-inline-flex justify-content-center align-items-center py-0 px-2 border text-capitalize fs-14 h-35px"  onClick={resetInput} > <i className="far fa-ban"></i> <span className="ml-1">Reset Answer</span></button>
                                                      </div>
                                                   </div>
                                             </div>
                                             <div className="col-6">
                                                   <div className="row justify-content-end">
                                                      {selected > 0 &&
                                                         <div className="col-auto text-right">
                                                            <button type="button" className="btn btn-light d-inline-flex justify-content-center align-items-center py-0 px-2 border text-capitalize fs-14 h-35px" onClick={() => loadQuestion(selected-1)} ><i className="far fa-long-arrow-alt-left"></i><span className="ml-1">prev</span>  </button>
                                                         </div>
                                                      }
                                                      <div className="col-auto pl-0 text-right">
                                                         <button type="button" className="btn btn-success d-inline-flex justify-content-center align-items-center py-0 px-2 border text-capitalize fs-14 h-35px" onClick={() => {selectionType("save"); saveInput(); loadQuestion(selected+1)}}> <i className="far fa-sign-out-alt"></i> <span className="ml-1">{"Save & Next"}</span></button>
                                                      </div>
                                                   </div>
                                             </div>
                                             </div>
                                          </div>
                                       </div>
                                 </div>
                                 <div className="col-auto test-body-right py-3 pl-0 h-100">
                                       <div className="row mx-0 h-100 overflow-hidden d-block">
                                          <div className="col-12">
                                             <div className="row">
                                             <div className="col-12 border test-times">
                                                   <div className="row text-center font-weight-bold fs-17 py-1 align-items-center">
                                                      <div className="col">
                                                         <div className="row">
                                                         <div className="col">{getTime("h")}</div>
                                                         </div>
                                                         <div className="row">
                                                         <div className="col fs-10 text-gray">Hours</div>
                                                         </div>
                                                      </div>
                                                      <div className="col">
                                                         <div className="row">
                                                         <div className="col">{getTime("m")}</div>
                                                         </div>
                                                         <div className="row">
                                                         <div className="col fs-10 text-gray">Minutes</div>
                                                         </div>
                                                      </div>
                                                      <div className="col">
                                                         <div className="row">
                                                         <div className="col">{getTime("s")}</div>
                                                         </div>
                                                         <div className="row">
                                                         <div className="col fs-10 text-gray">Seconds</div>
                                                         </div>
                                                      </div>
                                                   </div>
                                             </div>
                                             <div className="col-12 shadow border test-questions-box mt-2">
                                                   <div className="row py-1 align-items-center">
                                                      <div className="col-12">
                                                         <div className="row">
                                                         <div className="col-12 font-weight-bold fs-15 h-40px d-grid align-items-center bg-light border-bottom">{currentExam.name} Exam</div>
                                                         </div>
                                                      </div>
                                                      <div className="col-12 mb-2 overflow-auto test-question-box-h">
                                                         <div className="row">
                                                         <div className="col-12">
                                                               <div className="row row-cols-7 mx-n2">
                                                                  {questions.map((question, index) => {
                                                                     if (selected !== index && question.type === "mark" && question.input) {
                                                                        return <div key={index} className="col text-center py-2 px-0">
                                                                        <button type="button" className="position-relative overflow-unset btn btn-orange border p-0 mx-auto rounded-pill fs-14 w-35px h-35px d-grid align-items-center justify-content-center" onClick={() => loadQuestion(index)} > 
                                                                        <span className="review_mark fs-14 position-absolute top-n6px right-0px"><i className="fas fa-check text-success font-weight-bold"></i></span>   
                                                                        {index + 1}</button>
                                                                        </div>
                                                                     } else {
                                                                     return <div key={index} className="col text-center py-2 px-0">
                                                                     <button type="button" className={"btn border p-0 mx-auto rounded-pill fs-14 w-35px h-35px d-grid align-items-center justify-content-center " + getColor(index)} onClick={() => loadQuestion(index)} >{index + 1}</button>
                                                                     </div>
                                                                     }
                                                                  })}
                                                               </div>
                                                         </div>
                                                         </div>
                                                      </div>
                                                      <div className="col-12 test-finish-btn">
                                                         <div className="row">
                                                         <div className="col-12 py-1">
                                                               <div className="btn btn-danger d-block py-1 fs-15 text-capitalize" onClick={() => {showModal("exam_finish")}} ><i className="far fa-lock"></i> <span className="ml-1">Exam Finish</span></div>
                                                         </div>
                                                         <div className="col-12 py-1">
                                                               <div className="btn btn-info d-block py-1 fs-15 text-capitalize" onClick={() => {showModal("instructions")}}><i className="fal fa-question"></i> <span className="ml-1">Instructions</span></div>
                                                         </div>
                                                         </div>
                                                      </div>
                                                   </div>
                                             </div>
                                             </div>
                                          </div>
                                       </div>
                                 </div>
                                 </div>
                              </div>
                           </div>
                     </div>
                     <div className="col-12 text-footer h-60px shadow border-top">
                           <div className="row h-100 align-items-center">
                              <div className="col-12">
                                 <div className="row align-items-center">
                                 <div className="col fs-14 text-center text-gray"><b>Date & Time </b> {`${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} | ${date.getHours()}:${date.getMinutes()}`} </div>
                                 </div>
                              </div>
                           </div>
                     </div>
                     </div>
               </div>
               <div className="modal fade exam_finish" id="exam_finish" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" onClick={(event) => {hideModal("exam_finish", event)}}>
                  <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                     <div className="modal-content">
                        <div className="modal-header text-center bg-light shadow">
                           <h5 className="modal-title w-100 fs-18 text-uppercase" id="exampleModalLabel">Your Attempts</h5>
                           <button type="button" className="close position-absolute bg-light border shadow text-wite right-30px rounded-pill fs-20 w-25px h-25px p-0 d-flex justify-content-center align-items-center font-weight-normal top-32px" data-dismiss="modal" aria-label="Close" onClick={() => {hideModal("exam_finish")}}>
                           <span aria-hidden="true">&times;</span>
                           </button>
                        </div>
                        <div className="modal-body pb-0">
                           <div className="exam_attemped">
                              <div className="row">
                                 <div className="col-6">
                                    <div className="row d-inline-flex align-items-center mx-0 bg-green rounded py-0 px-0">
                                       <div className="col-auto pl-1 pr-2">
                                          <h3 className="fs-13 mb-0 text-white">Total Attempted:</h3>
                                       </div>
                                       <div className="col-auto pr-1  pl-0">
                                          <span className="fs-13 text-white">{questions.filter((question) => question.input).length}</span>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="col-6 text-right">
                                    <div className="row mx-0 d-inline-flex align-items-center bg-primary rounded py-0 px-0">
                                       <div className="col-auto pl-1 pr-2">
                                          <h3 className="fs-13 mb-0 text-white">Not Attempted:</h3>
                                       </div>
                                       <div className="col-auto pr-1 pl-0">
                                          <span className="fs-13 text-white">{questions.filter((question) => !question.input).length}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="row mt-5">
                                 <div className="col-12">
                                    <table className="table">
                                       <thead className="thead-dark">
                                          <tr>
                                             <th scope="col">Q NO.</th>
                                             <th scope="col">Status</th>
                                             <th scope="col">Q NO.</th>
                                             <th scope="col">Status</th>
                                             <th scope="col">Q NO.</th>
                                             <th scope="col">Status</th>
                                             <th scope="col">Q NO.</th>
                                             <th scope="col">Status</th>
                                             <th scope="col">Q NO.</th>
                                             <th scope="col">Status</th>
                                          </tr>
                                       </thead>
                                       <tbody id="questionTable">
                                       </tbody>
                                    </table>
                                 </div>
                              </div>
                              <div className="row border-top shadow bg-light mt-4 pt-3 pb-3">
                                 <div className="col-6 text-left">
                                    <button className="btn btn-danger d-inline-block py-1 mt-0 fs-14 text-capitalize" onClick={onFinish}><span className="">Submit</span></button>
                                 </div>
                                 <div className="col-6 text-right">
                                    <button type="button" data-dismiss="modal" className="btn btn-danger d-inline-block py-1 mt-0 fs-14 text-capitalize" onClick={() => {hideModal("exam_finish")}}><span className="">Close</span></button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="modal fade instruction" id="instructions" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" onClick={(event) => {hideModal("instructions", event)}}>
                  <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                     <div className="modal-content">
                        <div className="modal-body bg-light border rounded">
                           <div className="instruction_content position-relative row mx-0 shadow rounded bg-white p-3">
                              <div className="col-12 text-center">
                                 <strong className="pt-5 fs-18 d-block text-center text-secondary">- Please read the following instructions carefully -</strong>
                                 <span className="bg-secondary px-2 py-1 fs-13 rounded mt-3 d-inline-flex">{currentExam.name} Exam</span>
                              </div>
                              <div className="col-auto position-absolute right-0 top-0">
                                 <div className="row timer-box align-items-center bg-secondary shadow py-2">
                                    <div className="col-auto">
                                       <span className="d-flex align-items-center w-50px h-50px justify-content-center border rounded-pill p-0"><img className="img-fluid rounded-pill h-40px border shadow" src="/assets/img/profile.jpg" alt="" /></span>
                                    </div>
                                    <div className="col pl-0">
                                       <div id="timer" className="fs-13 d-flex ">
                                          <p className="fs-13 mr-1 mb-0">Time Left :-</p>
                                          <strong id="minutes" className="d-block">{getTime("m")}</strong>
                                          <span className="d-inline-block mx-1">:</span>
                                          <strong id="seconds" className="d-block">{getTime("s")}</strong>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="col-12 my-4">
                                 <div className="row">
                                    <div className="col-12 mb-3 fs-18 text-secondary font-weight-bold">General Instructions :-</div>
                                    <div className="col-12">
                                       <ul className="list_count list_count pl-4 mb-4">
                                          <li className="">
                                             <p className="fs-15">You have 60 minutes to complete the test.</p>
                                          </li>
                                          <li className="">
                                             <p className="fs-15">A countdown timer at the top right corner of your screen will display the time remaining for you to complete the exam. When the clock runs out, the exam ends by default - you are not required to end or submit your exam.</p>
                                          </li>
                                          <li className="">
                                             <p className="fs-15">The question palette at the right of the screen shows one of the following statuses of each of the questions numbered:</p>
                                             <ul className="list-unstyled">
                                                <li className="d-flex aligh-items-start mb-2">
                                                   <div className="rounded-pill fs-14 bg-light border shadow h-30px w-30px d-flex align-items-center justify-content-center"><i className="fad fa-hand-point-right"></i></div> 
                                                   <p className="fs-15 mb-0 d-flex align-items-center ml-2">You have not visited the question yet.</p>
                                                </li>
                                                <li className="d-flex aligh-items-start mb-2">
                                                   <div className="rounded-pill fs-14 bg-blue border shadow h-30px w-30px d-flex align-items-center justify-content-center"><i className="fad fa-hand-point-right"></i></div> 
                                                   <p className="fs-15 mb-0 d-flex align-items-center ml-2">You are currently viewing this question.</p>
                                                </li>
                                                <li className="d-flex aligh-items-start mb-2">
                                                   <div className="rounded-pill fs-14 bg-orange shadow h-30px w-30px d-flex align-items-center justify-content-center"><i className="fad fa-hand-point-right"></i></div> 
                                                   <p className="fs-15 mb-0 d-flex align-items-center ml-2">You have NOT answered the question but have marked the question for review.</p>
                                                </li>
                                                <li className="d-flex aligh-items-start mb-2">
                                                   <div className=" position-relative rounded-pill fs-14 bg-orange shadow h-30px w-30px d-flex align-items-center justify-content-center"><i className="fas fa-hand-point-right"></i>
                                                   <span className="fs-14 position-absolute top-n5px right-n2px"><i className="fas fa-check text-success font-weight-bold"></i></span>  </div> 
                                                   <p className="fs-15 mb-0 d-flex align-items-center ml-2">You have answered the question but marked it for review.</p>
                                                </li>
                                                <li className="d-flex aligh-items-start mb-2">
                                                   <div className="rounded-pill fs-14 bg-success shadow h-30px w-30px d-flex align-items-center justify-content-center"><i className="fad fa-hand-point-right"></i></div> 
                                                   <p className="fs-15 mb-0 d-flex align-items-center ml-2">You have answered the question.</p>
                                                </li>
                                                <li className="d-flex aligh-items-start mb-2">
                                                   <div className="rounded-pill fs-14 bg-red shadow h-30px w-30px d-flex align-items-center justify-content-center"><i className="fad fa-hand-point-right"></i></div> 
                                                   <p className="fs-15 mb-0 d-flex align-items-center ml-2">You have NOT answered the question.</p>
                                                </li>
                                             </ul>
                                          </li>
                                       </ul>
                                       <span className="fs-16 text-primary"><strong className="fs-16 text-secondary">Note :</strong> If an answer is selected for a question that is Marked for Review, the answer will be considered in the final evaluation.</span>
                                    </div>
                                 </div>
                                 <div className="row mt-4">
                                    <div className="col-12 mb-3 fs-18 text-secondary font-weight-bold">Navigating to a question :-</div>
                                    <div className="col-12">
                                       <ul className="list_count list_count pl-4 mb-4">
                                          <li className="">
                                             <p className="fs-15">To select a question to answer, you can do one of the following:</p>
                                             <ul className="pl-0 list-unstyled">
                                                <li className="">
                                                   <p className="d-flex fs-15 mb-3"><i className="mt-1 far fa-star mr-2 fs-14 text-secondary"></i>Click on the question number on the question palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.</p>
                                                </li>
                                                <li className="">
                                                   <p className="d-flex fs-15 mb-3"><i className="mt-1 far fa-star mr-2 fs-14 text-secondary"></i>Click on Save and Next to save answer to current question and to go to the next question in sequence.</p>
                                                </li>
                                                <li className="">
                                                   <p className="d-flex fs-15 mb-3"><i className="mt-1 far fa-star mr-2 fs-14 text-secondary"></i>Click on Mark for Review and Next to save answer to current question, mark it for review, and to go to the next question in sequence.</p>
                                                </li>
                                             </ul>
                                          </li>
                                          <li className="">
                                             <p className="fs-15">You can view the entire paper by clicking on the Question Paper button.</p>
                                          </li>
                                       </ul>
                                    </div>
                                 </div>
                                 <div className="row mt-2">
                                    <div className="col-12 mb-3 fs-18 text-secondary font-weight-bold">Answering questions :-</div>
                                    <div className="col-12">
                                       <ul className="list_count list_count pl-4 mb-4">
                                          <li className="">
                                             <p className="fs-15">For multiple choice type question :</p>
                                             <ul className="pl-0 list-unstyled">
                                                <li className="">
                                                   <p className="d-flex fs-15 mb-3"><i className="mt-1 far fa-star mr-2 fs-14 text-secondary"></i>To select your answer, click on one of the option buttons</p>
                                                </li>
                                                <li className="">
                                                   <p className="d-flex fs-15 mb-3"><i className="mt-1 far fa-star mr-2 fs-14 text-secondary"></i>To change your answer, click the another desired option button</p>
                                                </li>
                                                <li className="">
                                                   <p className="d-flex fs-15 mb-3"><i className="mt-1 far fa-star mr-2 fs-14 text-secondary"></i>To save your answer, you MUST click on Save & Next</p>
                                                </li>
                                                <li className="">
                                                   <p className="d-flex fs-15 mb-3"><i className="mt-1 far fa-star mr-2 fs-14 text-secondary"></i>To deselect a chosen answer, click on the chosen option again or click on the Clear Response button.</p>
                                                </li>
                                                <li className="">
                                                   <p className="d-flex fs-15 mb-3"><i className="mt-1 far fa-star mr-2 fs-14 text-secondary"></i>To mark a question for review click on Mark for Review & Next. If an answer is selected for a question that is Marked for Review, the answer will be considered in the final evaluation.</p>
                                                </li>
                                             </ul>
                                          </li>
                                          <li className="">
                                             <p className="fs-15">To change an answer to a question, first select the question and then click on the new answer option followed by a click on the Save & Next button.</p>
                                          </li>
                                          <li className="">
                                             <p className="fs-15">Questions that are saved or marked for review after answering will ONLY be considered for evaluation.</p>
                                          </li>
                                       </ul>
                                    </div>
                                 </div>
                                 <div className="row mt-2">
                                    <div className="col-12 mb-3 fs-18 text-secondary font-weight-bold">Navigating through sections :-</div>
                                    <div className="col-12">
                                       <ul className="list_count list_count pl-4 mb-4">
                                          <li className="">
                                             <p className="fs-15">Sections in this question paper are displayed on the top bar of the screen. Questions in a section can be viewed by clicking on the section name. The section you are currently viewing is highlighted.</p>
                                          </li>
                                          <li className="">
                                             <p className="fs-15">After clicking the Save & Next button on the last question for a section, you will automatically be taken to the first question of the next section.</p>
                                          </li>
                                          <li className="">
                                             <p className="fs-15">You can move the mouse cursor over the section names to view the status of the questions for that section.</p>
                                          </li>
                                          <li className="">
                                             <p className="fs-15">You can shuffle between sections and questions anytime during the examination as per your convenience.</p>
                                          </li>
                                       </ul>
                                    </div>
                                 </div>
                                 <div className="row d-none">
                                    <div className="col-12">
                                       <div className="instruction_footer mt-2 text-center border bg-light rounded shadow px-4 py-4">
                                          <div className="custom-control custom-checkbox mt-1 d-flex align-items-center">
                                             <input className="custom-control-input" type="checkbox" id="start-test" />
                                             <label className="custom-control-label fs-15 text-left" htmlFor="start-test">The computer provided to me is in proper working condition. I have read and understood the instructions given above</label>
                                          </div>
                                          <div className="btn btn-danger d-inline-block py-1 mt-3 fs-15 text-capitalize"><i className="far fa-edit"></i> <span className="ml-1">Start Exam</span></div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               {popup && <div className="modal-backdrop fade show"></div>}
            </div>
        )
    }
}

export default MainExam;