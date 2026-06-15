function Signup() {
    return(
        <>
        <div>
            <h1> Welcome to Yogashrini </h1>

        </div>
            <div>
                <label htmlFor = "name">
                 Username:
                </label>
                <br/>
                <input type="text" id = "name" placeholder="Enter Your Name"/ >
                <br/>
                

            <label htmlFor = "email">
                 Email:
                </label>
                <br/>
                <input type="email" id = "gmail" / >
                <br/>

                <label htmlFor = "password">
                 password:
                </label>
                <br/>
                <input type="password" id = "password"/ >
                <br/>

                <button title="Submit" color="#37b90cff"></button>

            </div>
        </>
    )
}
export default Signup;