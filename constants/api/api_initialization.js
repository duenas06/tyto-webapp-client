import axios from 'axios'

const API_INIT =  axios.create({
    // baseURL:process.env.NEXT_PUBLIC_TYTO_BASE_URL,
    baseURL:"",
    headers:
    {
        Accept: "application/json",
        Authorization: "Bearer Token",
        "Content-Type":"application/json",
        Token: typeof window !== 'undefined'?
                    localStorage.getItem("session_token") === null ?
                        ""
                        :
                        localStorage.getItem("session_token")
                    :
                    null,
    }
})



export default API_INIT;