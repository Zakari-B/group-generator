import { ChangeEvent, MouseEvent, useState } from 'react'
import './App.css'

function App() {
  //
  // EXEMPLE :
  //
  // const people: Person[] = [{ name: "Foo", weight: 2 }, { name: "Bar", weight: 1 }, { name: "Baz", weight: 5 }, { name: "Random Person", weight: 3 }, { name: "Another Random", weight: 4 }, { name: "This guy", weight: 2 }, { name: "That guy", weight: 3 }, { name: "Tux", weight: 1 }, { name: "Snake", weight: 5 }, { name: "Pacman", weight: 3 }, { name: "John", weight: 2 }, { name: "Doe", weight: 2 }, { name: "AnEvilStudent", weight: 1 }, { name: "Hackathon24685", weight: 4 }, { name: "User", weight: 3 }, { name: "Your_Cat_Overlord", weight: 5 }]
  //
  type Person = {
    name: string,
    weight: number
  }
  const people: Person[] = [{ name: "Foo", weight: 2 }, { name: "Bar", weight: 1 }, { name: "Baz", weight: 5 }, { name: "Random Person", weight: 3 }, { name: "Another Random", weight: 4 }, { name: "This guy", weight: 2 }, { name: "That guy", weight: 3 }, { name: "Tux", weight: 1 }, { name: "Snake", weight: 5 }, { name: "Pacman", weight: 3 }, { name: "John", weight: 2 }, { name: "Doe", weight: 2 }, { name: "AnEvilStudent", weight: 1 }, { name: "Hackathon24685", weight: 4 }, { name: "User", weight: 3 }, { name: "Your_Cat_Overlord", weight: 5 }]

  const [list, setList] = useState<Person[]>(people);
  const [personInput, setPersonInput] = useState<Person>({ name: "", weight: 1 });
  const [nbGroup, setNbGroup] = useState<number>(3);
  const [mode, setMode] = useState<number>(1);
  const [nbRetries, setNbRetries] = useState<number>(1);
  const [generatedGroups, setGeneratedGroups] = useState<Person[][][]>([]);
  const retryModes: number[] = [2, 3];
  const [showWeight, setShowWeight] = useState<boolean>(true);
  const weights: { [key: number]: string } = {
    1: "veryLow",
    2: "low",
    3: "medium",
    4: "high",
    5: "veryHigh",
  }

  const personDeleteHandler = (button: HTMLButtonElement) => {
    const target: number = list.findIndex((person) => (person.name === button.value.split("::")[0] && person.weight === parseInt(button.value.split("::")[1])));
    const listCopy: Person[] = [...list];
    listCopy.splice(target, 1);
    setList(() => [...listCopy])
  }

  const weightChangeHandler = (select: ChangeEvent<HTMLSelectElement>) => {
    if (select.target.getAttribute("data-target") == null) return;
    const target: string = select.target.getAttribute("data-target") as string

    const listCopy: Person[] = [...list];
    const listTarget: number = listCopy.findIndex((person) => (person.name === target.split("::")[0] && person.weight === parseInt(target.split("::")[1])));

    listCopy[listTarget] = { ...listCopy[listTarget], weight: parseInt(select.target.value) }
    setList(() => [...listCopy])
  }

  const setListHandler = (): void => {
    if (personInput.name.trim() !== "" && personInput.weight > 0 && personInput.weight <= 5) {
      setList(() => [...list, personInput])
      setPersonInput({ name: "", weight: 1 });
    }
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
    const tempArray: Person[][][] = [];

    let groupMakerArray: Array<Array<Person>> = [];
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
        // Get the smallest group, if some groups have an equal number of people, get the one with the smallest weight.
        const getSmallestGroup = (groups: Person[][]) => groups.reduce((p, c) => p.length > c.length ? c : (p.length === c.length) ? getTotalWeight(p) > getTotalWeight(c) ? c : p : p)
        // Get the total weight of a group.
        const getTotalWeight = (group: Person[]) => group.reduce((a, c) => a + c.weight, 0)
        // Get the group with the heaviest weight. If multiple groups have the same weight, pick the one with the most members.
        const getStrongestGroup = (groups: Person[][]) => groups.reduce((p, c) => getTotalWeight(p) > getTotalWeight(c) ? p : (getTotalWeight(p) === getTotalWeight(c)) ? p.length > c.length ? p : c : c);

        // Make a copy of the list, create a j variable for the loop and define how many balance passes we need (shouldn't need more than a few at most)
        const listCopy = [...list];
        let j = 0;
        const infinite_loop_safety = 50;
        const balance_passes = 5;

        // Run as long as I have not put everybody in a group
        while (listCopy.length > 0 && j < infinite_loop_safety) {
          // First select our targets and store the values (to avoid any error due to the value possibly changing when running the function multiple times)
          const smallestGroup = getSmallestGroup(groupMakerArray)
          const strongestGroup = getStrongestGroup(groupMakerArray)
          // Calculate the weight of the previous targets and the delta
          const smallestGroupWeight = getTotalWeight(smallestGroup)
          const strongestGroupWeight = getTotalWeight(strongestGroup)
          const weightDelta = strongestGroupWeight - smallestGroupWeight

          // Try to find the best candidate to make the two groups evenly weighted using the best possible weight then deviating by +/-1 per iteration.
          const getBestCandidate = () => {
            for (let i = 0; i < listCopy.length; i++) {
              const candidate = listCopy.findIndex((elem) => elem.weight === (Math.abs(strongestGroupWeight - smallestGroupWeight) + i)) || listCopy.findIndex((elem) => elem.weight === (Math.abs(strongestGroupWeight - smallestGroupWeight) - i))
              if (candidate !== -1) {
                return candidate
              }
            }
            // If no candidate can be found then pick a random person
            const candidate = Math.floor(Math.random() * listCopy.length)
            return candidate
          }

          // Locate and splice our best candidate, then insert him into the smallest group
          const bestCandidateIndex = getBestCandidate()
          const bestCandidate = listCopy.splice(bestCandidateIndex, 1)
          smallestGroup.push(...bestCandidate);
          j++

          // The balancer function that should run only when all the person have been put into groups to make sure we get the best possible outcome :
          const balanceGroups = (groups: Person[][]) => {
            // Get the weakest weight from the sample groups and store the value for the same reason as previously stated
            const getWeakestWeight = () => getTotalWeight(groups.reduce((p, c) => getTotalWeight(p) > getTotalWeight(c) ? c : p))
            const weakestWeight = getWeakestWeight()

            // Get the group or groups with the weakest weight(s) and store the values.
            const getWeakestGroups = (groups: Person[][]) => {
              const weakestGroups: Person[][] = [];
              groups.forEach((elem) => {
                getTotalWeight(elem) === weakestWeight ? weakestGroups.push(elem) : null;
              })
              return weakestGroups
            }
            const weakestGroupsList = getWeakestGroups(groups)

            // Get the group with the strongest weight and store the value.
            const strongestGroup = getStrongestGroup(groups)
            const strongestGroupWeight = getTotalWeight(strongestGroup)

            // Get the weight delta
            const weightDelta = strongestGroupWeight - weakestWeight;

            // Make the magic happen :
            // First, run a map function on the weakestGroupsList to deal with each of the groups in that array independently
            // Then, for each person in that weak group, we'll filter the strongest group to get a list of persons meeting the following requirements :
            // The absolute value of the difference between their weights must be equal to the floor of half the delta.
            // If this condition matches, we create a tuple  with those two persons and store it in a variable listing the people we can swap to balance the groups
            const swapList: Person[][] = [];
            weakestGroupsList.map((weakestGroup) => weakestGroup.forEach((weakPerson) => strongestGroup.filter((strongPerson) => Math.abs(Math.abs(strongPerson.weight) - Math.abs(weakPerson.weight)) === Math.floor(weightDelta / 2) ? swapList.push([strongPerson, weakPerson]) : null)))

            // If swapList is not empty, so if we actually have people we can swap, then
            if (swapList.length > 0) {
              // We start by defining variables pointing in groupMakerArray to the groups containing the people we identified earlier
              const groupMakerArrayWeakestGroup = groupMakerArray.filter((array) => array.includes(swapList[0][1]))[0]
              const groupMakerArrayStrongestGroup = groupMakerArray.filter((array) => array === strongestGroup)[0]
              const personToSwapFromStrong: Person[] = groupMakerArrayStrongestGroup.splice(groupMakerArrayStrongestGroup.indexOf(swapList[0][0]), 1);
              const personToSwapFromWeak = groupMakerArrayWeakestGroup.splice(groupMakerArrayWeakestGroup.indexOf(swapList[0][1]), 1)
              groupMakerArrayWeakestGroup.push(...personToSwapFromStrong);
              groupMakerArrayStrongestGroup.push(...personToSwapFromWeak);
            }

          }
          if (listCopy.length === 0) {
            for (let k = 0; k < balance_passes; k++) {
              balanceGroups(groupMakerArray);
            }
          }
        }
      }

      if (mode === 4) {
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
        <ul className="people-list">
          {list.map((person) => {
            return (
              <li className={showWeight ? weights[person.weight] : ''} key={person.name}>{person.name} {showWeight ?
                (
                  <select value={person.weight} data-target={person.name + "::" + person.weight} onChange={(e) => weightChangeHandler(e)} id="modeInput">
                    {[...Array(Object.keys(weights).length)].map((x, i) =>
                      <option key={"weight" + i + 1} value={i + 1}>{i + 1}</option>
                    )}
                  </select>
                ) : null}
                <button value={person.name + "::" + person.weight} className="del-button" onClick={(e: MouseEvent<HTMLButtonElement>) => personDeleteHandler(e.target as HTMLButtonElement)} />
              </li>
            )
          })}
        </ul>
        <div className="column">
          <label htmlFor="personInput">Add a person ?</label>
          <div>
            <input id="personInput" type="text" value={personInput.name} onChange={
              (e: ChangeEvent<HTMLInputElement>) => setPersonInput({ ...personInput, name: e.target.value })
            } onKeyDown={(e) => e.key === 'Enter' ? setListHandler() : null} />
            <select value={personInput.weight} onChange={
              (e: ChangeEvent<HTMLSelectElement>) => setPersonInput({ ...personInput, weight: parseInt(e.target.value) })
            } id="modeInput">
              {[...Array(Object.keys(weights).length)].map((x, i) =>
                <option key={"weight" + i + 1} value={i + 1}>{i + 1}</option>
              )}
            </select>
          </div>
          <button onClick={() => setListHandler()}>Add !</button>
          <div className="inputRow">
            <label htmlFor="weightCheckbox">Show weights ?</label>
            <input type="checkbox" id="weightCheckbox" defaultChecked={showWeight} onChange={() => setShowWeight(() => !showWeight)} />
          </div>
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
              <option value="3">Weighted</option>
              <option value="4">Get a random person</option>
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
        {generatedGroups.length > 0 && generatedGroups[0][0].length === 1 && generatedGroups[0][1].length === 0 ?
          <div className="generatedGroups group">
            <h2>{generatedGroups[0][0][0].name}</h2>
          </div>
          :
          generatedGroups.length > 0 && generatedGroups ? generatedGroups.map((groups, index) => {
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
                              <li key={"person" + index} className={showWeight ? weights[person.weight] : ''} >{person.name} {showWeight ? person.weight : null}</li>
                            )
                          })
                        }
                        {showWeight ? <li>Total score: {group.reduce((a, c) => a + c.weight, 0)}</li> : null}
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
