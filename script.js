//EVENT LISTENERS
window.addEventListener("load", () => {
  document.getElementById("get").addEventListener("click", getTodos);
  document.getElementById("post").addEventListener("click", postTodos);
  document.getElementById("put").addEventListener("click", putTodos);
  document.getElementById("delete").addEventListener("click", deleteTodos);
  document.getElementById("simRequests").addEventListener("click", simRequestsTodos);
  document.getElementById("errHandling").addEventListener("click", errHandling);

  function getTodos() {
    //THIS IS THE LONG WAY OF USING AXIOS
    // axios({
    //     method: 'GET',
    //     url: 'https://jsonplaceholder.typicode.com/posts',
    //     params: {
    //         _limit: 2
    //     }
    // })//this above returns a promise
    // .then(response=>{
    //     showData(response)
    // })
    // .catch(err=>console.error(err))

    //THIS IS THE SHORT WAY OF USING AXIOS
    axios
      .get("https://jsonplaceholder.typicode.com/posts", {
          params:{
              _limit: 5
          }
      })
      .then((response) => showData(response))
      .catch((err) => console.error(err));
    //and even no need to use axios.get() --> we can ignore using get, as get() is default kind of thing, for post and other requests
    // we need to explicitly mention that
  }
  function postTodos() {
    axios({
      method: "POST",
      url: "https://jsonplaceholder.typicode.com/posts",
      data:{
          'Todo': 'New Todo',
          completed: false
      }
    }) //this above returns a promise
      .then((response) => {
        showData(response);
      })
      .catch((err) => console.error(err));
  }
  function deleteTodos(){
    axios({
        method: 'DELETE',
        url: 'https://jsonplaceholder.typicode.com/posts/1'
    })
    .then(response=>showData(response))
    .catch((err)=>console.error(err));
  }
  function putTodos(){
    axios({
        method: 'PUT',
        url: 'https://jsonplaceholder.typicode.com/posts/1'
    })
    .then(response=>showData(response))
    .catch((err)=>console.error(err));
  }
  function simRequestsTodos(){
      /*1. axios.all() helps us to make concurrent requests simulataneously
        2. axios.all() function accepts an array and returns an array of responses
        3. when we do .then() --> we have various responses, so either we do response[0] like this
        or use axios.spread() to name all the responses coming from .all()
      */
      axios.all(
          [
            axios.post('https://jsonplaceholder.typicode.com/posts?_limit=5'),
            axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
          ]
      )
      .then(
        //   (res)=>{
        //   console.log(res[0]);
        //   console.log(res[1]);
          axios.spread((posts, users)=>{
            console.log("Inside spread method of axios");
            // showData(posts);
            showData(users);
          })
    //   }
      )
      //axios.spread() allows us to give more descriptive variable names
      .catch(err=>console.error(err));
  }
  function errHandling(){
    //STATUS 200 - OK
    axios
      .get("https://jsonplaceholder.typicode.com/postss")
      .then((response) => showData(response))
      .catch((err)=>{
        console.log(err.response.status);
        console.log(err.response.data);
        console.log(err.response.headers);
        if(err.response.status === 404){
          alert('Page not found!')
        }
        else if(err.request){
        // REQUEST WAS MADE BUT NO RESPONSE 
         console.log(err.request)
        }
        else{
          console.log(err.message)
        }
      });
  }
  function showData(res) {
    document.getElementById("resultContainer").innerHTML = `
    <div class="card card-body mb-4">
      <h5>Status: ${res.status}</h5>
    </div>
    <div class="card mt-3">
      <div class="card-header">
        Headers
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.headers, null, 2)}</pre>
      </div>
    </div>
    <div class="card mt-3">
      <div class="card-header">
        Data
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.data, null, 2)}</pre>
      </div>
    </div>
    <div class="card mt-3">
      <div class="card-header">
        Config
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.config, null, 2)}</pre>
      </div>
    </div>
  `;
  }

//INTERCEPTING REQUESTS AND RESPONSES
//CREATE LOGGER EVERY TIME WE SEND GET REQUEST
axios.interceptors.request.use(
    config=>{
        console.log(`Request method is ${config.method.toUpperCase()} and Url is ${config.url} sent at timestamp ${new Date()}`);
        return config;
    },
    error=>{
        return Promise.reject(error);
    }
)

});
