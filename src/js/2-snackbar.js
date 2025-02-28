import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

document.querySelector(".form").addEventListener("submit", (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const delay = Number(form.elements.delay.value);
    const promiseState = form.elements.state.value;

    if (delay <= 0) {
        iziToast.warning({
            title: "⚠ Warning",
            message: "Delay must be greater than 0ms",
            position: "topRight",
            timeout: 3000,
        });
        return;
    }

    createPromise(delay, promiseState)
        .then((delay) => {
            iziToast.success({
                title: "OK",
                message: `Fulfilled promise in ${delay}ms`,
                position: "topRight",
                timeout: 5000,
            });
        })
        .catch((delay) => {
            iziToast.error({
                title: "Error",
                message: `Rejected promise in ${delay}ms`,
                position: "topRight",
                timeout: 5000,
            });
        });

    form.reset();
});

function createPromise(delay, promiseState) {
    return new Promise((resolve, reject) =>
        setTimeout(() => (promiseState === "fulfilled" ? resolve(delay) : reject(delay)), delay)
    );
}