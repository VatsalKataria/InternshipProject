import { useEffect, useState } from "react";
import axios from 'axios';

const Test = () =>{

    const [users, setUsers] = useState([])
    useEffect(()=> {
        axios.get('http://localhost:3000/userdata')
        .then(response => setUsers(response.data))
        .catch(err => console.log(err))
    },[])

    return(
        <>
        <div>
            <table>
                <tbody>
                    {
                        users.map(user => (
                            <tr key={user._id}>
                                <td>{user.userid}</td>
                                <td>{user.text_data}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
        </>
    )
}

export default Test;