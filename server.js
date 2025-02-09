import {app} from "./Config/app.js"

const port = 8080

app.listen(port, () => {
    console.log("connected to localhost:8080")
})