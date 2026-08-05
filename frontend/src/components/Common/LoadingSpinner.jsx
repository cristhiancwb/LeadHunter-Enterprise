import "./LoadingSpinner.css";

export default function LoadingSpinner({

    message = "Carregando...",

    size = "medium"

}) {

    const spinnerClass = `spinner spinner-${size}`;

    return (

        <div className="loading-spinner">

            <div className={spinnerClass}></div>

            <p className="loading-message">

                {message}

            </p>

        </div>

    );

}