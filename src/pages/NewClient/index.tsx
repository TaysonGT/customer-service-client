import NewClientForm from "../../features/crm/NewClientForm"


const NewClientPage = () => {
  return (
    <div className='p-10'>
        <title>Haus | New Client</title>
        <h1 className='text-center text-3xl font-bold'>Create New Client</h1>
        <NewClientForm {...{onCancel: () => console.log('Cancel'), onSubmit: () => console.log('Submit')}}/>
    </div>
  )
}

export default NewClientPage