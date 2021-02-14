import { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button';
import {useHistory,NavLink} from "react-router-dom";

function VerifyEmail({ match }) {
    const history = useHistory();
    const [showVerify, setShowVerify] = useState(false);

    const {
        params: { token },
    } = match;


    useEffect(() => {
        fetch(`https://payroll-sys13.herokuapp.com/verify/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: token,
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.success == 1)
            {
                setShowVerify(true)
            }
        })
    }, [token])

    const redirect = () => {
        history.push("/");
    }

    return (
        <div>
            <br/><br/>
            <h4>{ showVerify ? "Email Verified": "Email not verified"}</h4>
            <br/>
            <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={redirect}
            >
                Return
            </Button>
        </div>
    )
}

export default VerifyEmail
