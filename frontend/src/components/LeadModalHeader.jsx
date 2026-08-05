import {
    X
} from "lucide-react";


export default function LeadModalHeader({

    lead,

    onClose

}){


    return (

        <div className="modal-header">


            <div>


                <h2>

                    {lead.empresa}

                </h2>


                <span>

                    Lead #{lead.id}

                </span>


            </div>



            <button

                className="close-button"

                onClick={onClose}

            >

                <X size={22}/>

            </button>



        </div>

    );


}