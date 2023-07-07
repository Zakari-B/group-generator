import { ChangeEvent, useState } from 'react'
import './App.css'

function App() {
  //
  // EXEMPLE :
  //
  const people: string[] = ["Foo", "Bar", "Baz", "Random Person", "Another Random", "This guy", "That guy", "Tux", "Snake", "Pacman"]
  //

  // const people: string[] = []

  const [list, setList] = useState<string[]>(people);
  const [personInput, setPersonInput] = useState<string>("");
  const [nbGroup, setNbGroup] = useState<number>(3);
  const [mode, setMode] = useState<number>(1);
  const [nbRetries, setNbRetries] = useState<number>(1);
  const [generatedGroups, setGeneratedGroups] = useState<string[][][]>([]);
  const retryModes = [2];

  const personInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPersonInput(e.target.value);
  }

  const nbGroupHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNbGroup(parseInt(e.target.value));
  }

  const setModeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setMode(parseInt(e.target.value));
  }

  const nbRetriesHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNbRetries(parseInt(e.target.value));
  }

  const groupGen = async () => {
    let retries;
    retryModes.includes(mode) ? retries = nbRetries : retries = 1;
    const tempArray: string[][][] = [];

    let groupMakerArray: Array<Array<string>> = [];
    const resetGroupMaker = () => {
      groupMakerArray = [];
      for (let i = 0; i < nbGroup; i++) {
        groupMakerArray[i % nbGroup] = [];
      }
    }
    resetGroupMaker();

    for (let j = 0; j < retries; j++) {
      if (mode === 1) {
        for (let k = 0; k < list.length; k++) {
          groupMakerArray[k % nbGroup].push(list[k]);
        }
      }
      if (mode === 2) {
        const infinite_loop_safety = 50;
        const listCopy = [...list];
        let j = 0;
        while (listCopy.length > 0 && j < infinite_loop_safety) {
          const chosenIndex = Math.floor(Math.random() * (listCopy.length));
          const person = listCopy.splice(chosenIndex, 1);
          const shortestArray = groupMakerArray.reduce(function (p, c) {
            return p.length > c.length
              ? c
              : (p.length === c.length)
                ? Math.floor(Math.random() * 2) === 0 ? c : p
                : p;
          });
          shortestArray.push(...person)
          j++;
        }
      }
      if (mode === 3) {
        const chosenIndex = Math.floor(Math.random() * (list.length));
        groupMakerArray[0].push(list[chosenIndex]);
      }
      tempArray.push(groupMakerArray);
      resetGroupMaker()
    }
    setGeneratedGroups(() => tempArray)
  }

  return (
    <>
      <div className="listContainer group">
        <ul>
          {list.map((person) => {
            return (
              <li key={person}>{person}</li>
            )
          })}
        </ul>
        <div className="column">
          <label htmlFor="personInput">Add a victim ?</label>
          <input id="personInput" type="text" value={personInput} onChange={(e: ChangeEvent<HTMLInputElement>) => personInputHandler(e)} />
          <button onClick={() => setList(() => [...list, personInput])}>Add !</button>
        </div>
        <div className="column">
          <div className="inputRow">
            <label htmlFor="groupNumberInput">How many groups do you want ?</label>
            <input id="groupNumberInput" type="number" value={nbGroup} onChange={(e: ChangeEvent<HTMLInputElement>) => nbGroupHandler(e)} />
          </div>
          <div className="inputRow">
            <label htmlFor="modeInput">Select the method to use :</label>
            <select value={mode} onChange={(e) => setModeHandler(e)} id="modeInput">
              <option value="1">One by one</option>
              <option value="2">Chaotic</option>
              <option value="3">Get a random person</option>
            </select>
          </div>
          <div className="inputRow">
            <label htmlFor="modeInput">How many retries ?</label>
            <input id="groupNumberInput" type="number" value={nbRetries} onChange={(e: ChangeEvent<HTMLInputElement>) => nbRetriesHandler(e)} disabled={!retryModes.includes(mode)} />
          </div>
          <button onClick={() => groupGen()}>Start</button>
        </div>
      </div>
      <div className="resultBox group">
        {generatedGroups.length > 0 && generatedGroups[0][0].length === 1 ?
          <div className="generatedGroups group">
            <h2>{generatedGroups[0][0]}</h2>
          </div>
          :
          generatedGroups.length > 0 && generatedGroups[0][0].length > 1 && generatedGroups ? generatedGroups.map((groups, index) => {
            return (
              <div className="generatedGroups group" key={"groups" + index}>
                {groups.map((group, index) => {
                  return (
                    <div className="groups" key={"group" + index}>
                      <h2>Group {index + 1}</h2>
                      <ul>
                        {
                          group.map((person, index) => {
                            return (
                              <li key={"person" + index}>{person}</li>
                            )
                          })
                        }
                      </ul>
                    </div>
                  )
                })}
              </div>
            )
          }) : (<h2>No groups yet !</h2>)}
      </div>
    </>
  )
}

export default App
