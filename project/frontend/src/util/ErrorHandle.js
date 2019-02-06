export function handleHTTPError(response) {
    if (!response.ok) {
        throw Error(response.status);
    }
    return response;
}

export function checkAuthTokenAndRedirect(err) {
    if (err.message === "401") {
        if (localStorage.getItem('token')) {
            console.log("Bad Token");
            localStorage.removeItem('token')
        }
        this.props.history.push('/')
    } else {
        console.log(err)
    }
}

export default {checkAuthTokenAndRedirect, handleHTTPError}