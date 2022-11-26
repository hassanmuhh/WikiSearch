import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [term, setTerm] = useState("");
  const [list, setList] = useState([]);
  const ref = useRef();
  const prevTerm = ref.current;

  useEffect(() => {
    ref.current = term;
  }, [term]);

  useEffect(() => {
    const searchAPI = async () => {
      const response = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          list: "search",
          format: "json",
          origin: "*",
          srsearch: term,
        },
      });
      setList(response.data.query.search);
    };

    // depounceSearch => ta2kher request ll api
    if (!list.length && term) {
      searchAPI();
    } else if (prevTerm !== term) {
      const depounceSearch = setTimeout(() => {
        if (term) {
          searchAPI();
        }
      }, 1000);

      return () => {
        clearTimeout(depounceSearch);
      };
    }
  }, [term, list.length, prevTerm]);

  const showList = list.map((el, idx) => {
    return (
      <tr key={el.pageid}>
        {/* <td>{idx}</td> */}
        <td style={{ fontWeight: "bold", color: "aliceblue" }}>{el.title}</td>
        <td>
          <span
            dangerouslySetInnerHTML={{ __html: el.snippet }}
            style={{ color: "aliceblue" }}
          />
        </td>
      </tr>
    );
  });

  useEffect(() => {
    if (term.length === 0) {
      document.querySelector('table').style.display = `none`;
      var div = document.createElement("div");
      var textInDiv = document.createElement("h2");
      textInDiv.innerHTML = "There is NO value to present !!";
      textInDiv.style.cssText = `
        color:aliceblue;
        text-align:center;
        background-color: #171717;
        padding: 39px;
        width: fit-content;
        margin:140px auto;
        font-size: 30px;
        font-family: monospace;
        letter-spacing: -1px;
        border-radius:7px;
      `;
      div.classList.add("tempDiv");
      div.appendChild(textInDiv);
      document.body.append(div);
    } else {
      document.querySelector('table').style.display = `table`;
      document.querySelector("h1").style.display = "none";
      document.querySelector(".tempDiv").style.display = "none";
    }
  }, [term.length]);
  return (
    <>
      <h1>WikiPedia Search Engine</h1>
      <div className="container">
        <form>
          <div className="mb-3 mt-4">
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Search Input"
              onChange={(e) => {
                setTerm(e.target.value);
              }}
              value={term}
            />
          </div>
        </form>
        <div className="row mt-2">
          <table className="table table-striped mt-4">
            <thead>
              <tr>
                {/* <th scope="col">#</th> */}
                <th scope="col">Title</th>
                <th scope="col" style={{ textAlign: "center" }}>
                  Description
                </th>
              </tr>
            </thead>
            <tbody>{showList}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
