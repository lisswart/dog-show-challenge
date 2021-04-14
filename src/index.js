document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('DOMContentLoaded', DogController.init)
})

class Dog {
    constructor({name, breed, sex, id}) {
      this.name = name
      this.breed = breed
      this.sex = sex
      this.id = id
    }
  
    element() {
      const row = document.createElement('tr')
      row.id = `dog-${this.id}`
      const sex = document.createElement('td')
      sex.innerText = this.sex
      sex.classList.add('sex')
      const name = document.createElement('td')
      name.innerText = this.name
      name.classList.add('name')
      const breed = document.createElement('td')
      breed.innerText = this.breed
      breed.classList.add('breed')
      const edit = document.createElement('td')
      const btn = document.createElement('button')
      btn.innerText = 'Edit Dog'
      btn.dataset.id = this.id
      btn.addEventListener('click', DogController.handleClick)
      edit.append(btn)
      row.append(name, breed, sex, edit)
      return row
    }
  }

  class Adapter {
    static getDogs() {
      const url = `http://localhost:3000/dogs`
      return fetch(url)
        .then(r => r.json())
    }
  
    static getDog(id) {
      const url = `http://localhost:3000/dogs/${id}`
      return fetch(url)
        .then(r => r.json())
    }
  
    static editDog(data) {
      const url = `http://localhost:3000/dogs/${data.id}`
      delete data.id
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
      return fetch(url, options)
        .then(r => r.json())
    }
  }

  class DogController {
    static init() {
      Adapter.getDogs()
        .then(DogController.renderDogs)
      const form = document.querySelector('#dog-form')
      form.addEventListener('submit', DogController.handleSubmit)
    }
  
    static renderDogs(dogs) {
      const table = document.querySelector('#table-body')
      table.innerHTML = ''
      dogs.forEach(DogController.renderDog)
    }
  
    static renderDog(dog) {
      const table = document.querySelector('#table-body')
      const newDog = new Dog(dog)
      table.append(newDog.element())
    }
  
    static handleClick(e) {
      const id = e.target.dataset.id
      Adapter.getDog(id)
        .then(DogController.populateForm)
    }
  
    static populateForm(dog) {
      const newDog = new Dog(dog)
      const form = document.querySelector('#dog-form')
      form.dataset.id = newDog.id
      form.name.value = newDog.name
      form.breed.value = newDog.breed
      form.sex.value = newDog.sex
    }
  
    static handleSubmit(e) {
      e.preventDefault()
      const data = {
        id: e.target.dataset.id,
        name: e.target.name.value,
        breed: e.target.breed.value,
        sex: e.target.sex.value
      }
      Adapter.editDog(data)
        .then(Adapter.getDogs)
        .then(DogController.renderDogs)
      e.target.reset()
      e.target.dataset.id = ''
    }
  }