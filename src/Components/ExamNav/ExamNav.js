const ExamNav = ({exam, removeToken}) => {

    const SignOut = () => {
        if (exam) {
            localStorage.removeItem("token");
            localStorage.removeItem("selected");
            localStorage.removeItem("result");
            localStorage.removeItem("questions");
            localStorage.removeItem("exam");
            removeToken()
        } else {
            localStorage.removeItem("token");
            removeToken()
        }
    }

    return (
            <nav className="dt w-100 border-box pa3 ph5-ns">
                <div className="dtc v-mid w-75 tr">
                    <div className="f4 w-25">{exam ? exam + " Exam" : ""}</div>
                    <div className="link dim dark-gray f6 f5-ns dib pointer" onClick={SignOut}>Sign Out</div>
                </div>
            </nav>
    )
}

export default ExamNav;