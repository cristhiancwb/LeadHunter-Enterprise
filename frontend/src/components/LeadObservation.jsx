export default function LeadObservation({

    observacao,

    setObservacao

}){


return (

<div className="form-group">


<label>

Observação comercial

</label>



<textarea


value={observacao}


onChange={

e =>

setObservacao(

e.target.value

)

}


placeholder="Adicionar observações..."


/>



</div>

);


}