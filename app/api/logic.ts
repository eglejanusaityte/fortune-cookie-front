export default function userIsOnline() {
    if (localStorage.getItem('token') !== null) {
        return true;
    }
    return false;
}
