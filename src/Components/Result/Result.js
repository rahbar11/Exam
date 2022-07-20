import { Component } from "react";
import axios from "axios"

class Result extends Component {
    constructor(props) {
        super();
        this.state = {
            questions: []
        }
    }

    inputNumber = (input) => {
      if (input) {
        return Number(input) + 1
      } else {
        return ""
      }
    }

    componentDidMount() {
        axios.post("https://exam-panel.herokuapp.com/api/result", {questions: this.props.questions, examid: this.props.currentExam._id}, {headers:{Authorization: this.props.token}})
        .then(res => this.setState({questions: res.data}))

    }

    render() {
        return (
            <div className="pa4">
            <div className="overflow-auto">
              <table className="f6 w-100 mw8 center" cellSpacing="0">
                <thead>
                  <tr className="stripe-dark">
                    <th className="fw6 tl pa3 bg-white">Question</th>
                    <th className="fw6 tl pa3 bg-white">Options</th>
                    <th className="fw6 tl pa3 bg-white">Correct</th>
                    <th className="fw6 tl pa3 bg-white">Selected</th>
                  </tr>
                </thead>
                <tbody className="lh-copy">
                    {this.state.questions.map((question, index) => {
                        return <tr key={index} className="stripe-dark">
                            <td className="pa3">{question.question}</td>
                            <td className="pa3">{question.options.join(", ")}</td>
                            <td className="pa3">{question.correct}</td>
                            <td className="pa3">{this.inputNumber(question.input)}</td>
                        </tr>
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )
    }
}

export default Result;