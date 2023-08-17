import { Component } from "react";
import axios from "axios";
import SelectExam from "../SelectExam/SelectExam";
import MainExam from "../MainExam/MainExam";
import Result from "../Result/Result";
import ExamNav from "../ExamNav/ExamNav";

class Exam extends Component {
    constructor(props) {
        super();
        this.state = {
            exams: [],
            examsDone: [],
            examIndex: -1,
            questions: [],
            error: "",
            currentExam: {},
            mainExam: "",
            result: "",
            startingTime: 0
        }
    }

    onSelect = (event) => {
        this.setState({examIndex: event.target.value})
    }

    onSubmit = () => {
        const {examIndex, exams} = this.state
        if (examIndex !== -1) {
            const selectedExam = exams[examIndex]
            axios.post("https://exam-management-1h1y.onrender.com/api/questions", {examid: selectedExam._id}, {headers:{Authorization: this.props.token}})
                .then(res => {
                    const mainExam = this.props.token
                    localStorage.setItem("questions", JSON.stringify(res.data));
                    localStorage.setItem("exam", JSON.stringify(selectedExam))
                    localStorage.setItem("mainExam", this.props.token);
                    const startingTime = new Date().getTime()
                    localStorage.setItem("startingTime", startingTime)
                    this.setState({questions: res.data, currentExam: selectedExam, mainExam, startingTime})
                })
                .catch(() => localStorage.removeItem("token"))
        } else {
            this.setState({error: "Please select an exam!"})
        }
    }

    confirmFinish = (confirm) => {
        const {questions, currentExam} = this.state
        if (confirm) {
            axios.post("https://exam-management-1h1y.onrender.com/api/finish", {questions, examid: currentExam._id}, {headers:{Authorization: this.props.token}})
                   .then(res => {
                       if (res.data === "success") {
                         this.setState({mainExam: "", result: this.props.token})
                         localStorage.removeItem("mainExam");
                         localStorage.setItem("result", this.props.token)
                       }
                   })
                   .catch(() => localStorage.removeItem("token"))
         }
    }

    onFinish = () => {
        const confirm = window.confirm('Please click on "OK" to Submit only after reviewing all answers!');
        this.confirmFinish(confirm)
      }

    componentDidMount() {
        const questions = localStorage.getItem("questions");
        const currentExam = localStorage.getItem("exam");
        const startingTime = localStorage.getItem("startingTime");
        if (questions) {
            this.setState({questions: JSON.parse(questions)});
            this.setState({currentExam: JSON.parse(currentExam)});
            this.setState({startingTime: JSON.parse(startingTime)})
        }
        const mainExam = localStorage.getItem("mainExam");
        const result = localStorage.getItem("result");
        this.setState({mainExam, result})
        axios.post("https://exam-management-1h1y.onrender.com/api/exams", {}, {headers:{Authorization: this.props.token}})
            .then(res => this.setState({exams: res.data.exams, examsDone: res.data.examsDone}))
            .catch(() => localStorage.removeItem("token"));
    }

    render() {
        const {exams, currentExam, questions, error, examsDone, mainExam, result, startingTime} = this.state
        return (
            <>
                {mainExam === this.props.token
                    ? <MainExam startingTime={startingTime} questions={questions} currentExam={currentExam} onFinish={this.onFinish} confirmFinish={this.confirmFinish} /> 
                    : ( result === this.props.token 
                        ?<> <ExamNav exam={currentExam.name} removeToken={this.props.removeToken} /> <Result currentExam={currentExam} questions={questions} token={this.props.token} /> </>
                        :<> <ExamNav exam={""} removeToken={this.props.removeToken} /> <SelectExam onSelect={this.onSelect} onSubmit={this.onSubmit} examsDone={examsDone} exams={exams} error={error} /> </>)}
            </>
        )
    }
}

export default Exam;