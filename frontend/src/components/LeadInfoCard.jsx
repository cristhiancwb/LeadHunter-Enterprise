import {

    Phone,
    Mail,
    MapPin,
    Building2,
    Target

} from "lucide-react";



export default function LeadInfoCard({

    lead

}){


return (

<div className="lead-info">


<p>

<Building2 size={16}/>

{lead.segmento || "-"}

</p>



<p>

<MapPin size={16}/>

{lead.cidade || "-"}

</p>



<p>

<Phone size={16}/>

{lead.telefone || "-"}

</p>



<p>

<Mail size={16}/>

{lead.email || "-"}

</p>



<p>

<Target size={16}/>

Score:

{" "}

{lead.score || 0}

</p>


</div>

);


}