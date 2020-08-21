const deleteButton = document.getElementById('delete-button');

console.log('Delete Button' + deleteButton);
deleteButton.addEventListener("click", (_) => {
    console.log('delete button clicked');
  fetch("/api/data", {
    method: "delete",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((response) => {
      response.json("#Deleted Records:" + result.deletedCount);
      res.redirect("/view/data");
      if (response === "No quote to delete") {
      } else {
        window.location.reload(true);
      }
    })
    .catch(console.error);
});


/*
if (result.deletedCount === 0) {
  return res.json('No quote to delete')
}*/
