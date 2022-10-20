function removePayment(obj) {
    let item = `${obj.id}-card`;
    let coll = document.getElementById(`${item}`);
    console.log(coll);
    coll.remove()
}