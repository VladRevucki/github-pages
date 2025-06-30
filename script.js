const addBtn = document.getElementById("addBtn")
const dialog = document.getElementById("entryDialog")
const form = document.getElementById("entryForm")
const cancelBtn = document.getElementById("cancelBtn")
const tbody = document.getElementById("tableBody")
const searchInput = document.getElementById("searchInput")

addBtn.addEventListener("click", () => {
	openDialog()
})

cancelBtn.addEventListener("click", () => {
	dialog.close()
})

form.addEventListener("submit", e => {
	e.preventDefault()

	const name = document.getElementById("name").value.trim()
	const date = document.getElementById("date").value.trim()
	const numberVal = parseFloat(document.getElementById("number").value.trim())
	const rowIdxStr = document.getElementById("rowIndex").value

	if (!name || !date || isNaN(numberVal)) {
		alert("Пожалуйста, заполните все поля корректно.")
		return
	}

	const data = { name, date, number: numberVal }

	if (rowIdxStr === "") {
		addRow(data)
	} else {
		updateRow(+rowIdxStr, data)
	}

	dialog.close()
})

function openDialog(rowData = null, rowIdx = null) {
	form.reset()
	if (rowData) {
		document.getElementById("name").value = rowData.name
		document.getElementById("date").value = rowData.date
		document.getElementById("number").value = rowData.number

		document.getElementById("dialogTitle").textContent = "Редактировать запись"

		document.getElementById("rowIndex").value = rowIdx
	} else {
		document.getElementById("dialogTitle").textContent = "Добавить запись"
		document.getElementById("rowIndex").value = ""
	}

	dialog.showModal()
}

function addRow(data) {
	const tr = document.createElement("tr")

	tr.innerHTML = `
   <td>${data.name}</td>
   <td>${data.date}</td>
   <td>${data.number}</td>
   <td>
     <button class='action-btn edit' title='Редактировать'>&#9998;</button> 
     <button class='action-btn delete' title='Удалить'>&#128465;</button> 
   </td>`

	tr.querySelector(".edit").addEventListener("click", () => {
		const index = Array.prototype.indexOf.call(tbody.children, tr)
		openDialog({ name: data.name, date: data.date, number: data.number }, index)
	})
	tr.querySelector(".delete").addEventListener("click", () => {
		if (confirm("Удалить?")) {
			tbody.removeChild(tr)
		}
	})

	tbody.appendChild(tr)
}

function updateRow(index, data) {
	const tr = tbody.children[index]
	if (tr) {
		tr.children[0].textContent = data.name
		tr.children[1].textContent = data.date
		tr.children[2].textContent = data.number

		tr.querySelector(".edit").addEventListener("click", () => {
			openDialog(
				{ name: data.name, date: data.date, number: data.number },
				index
			)
		})
	}
}

searchInput.addEventListener("input", filterTable)

function filterTable() {
	const query = searchInput.value.toLowerCase()
	const rows = document.querySelectorAll("#tableBody tr")
	rows.forEach(row => {
		const cells = row.children
		let match = false
		for (let cell of cells) {
			if (cell.textContent.toLowerCase().includes(query)) {
				match = true
				break
			}
		}
		row.style.display = match ? "" : "none"
	})
}
