"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/robot3";
exports.ids = ["vendor-chunks/robot3"];
exports.modules = {

/***/ "(rsc)/./node_modules/robot3/dist/machine.js":
/*!*********************************************!*\
  !*** ./node_modules/robot3/dist/machine.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n\nfunction valueEnumerable(value) {\n  return { enumerable: true, value };\n}\n\nfunction valueEnumerableWritable(value) {\n  return { enumerable: true, writable: true, value };\n}\n\nlet d = {};\nlet truthy = () => true;\nlet empty = () => ({});\nlet identity = a => a;\nlet callBoth = (par, fn, self, args) => par.apply(self, args) && fn.apply(self, args);\nlet callForward = (par, fn, self, [a, b]) => fn.call(self, par.call(self, a, b), b);\nlet create = (a, b) => Object.freeze(Object.create(a, b));\n\nfunction stack(fns, def, caller) {\n  return fns.reduce((par, fn) => {\n    return function(...args) {\n      return caller(par, fn, this, args);\n    };\n  }, def);\n}\n\nfunction fnType(fn) {\n  return create(this, { fn: valueEnumerable(fn) });\n}\n\nlet reduceType = {};\nlet reduce = fnType.bind(reduceType);\nlet action = fn => reduce((ctx, ev) => !!~fn(ctx, ev) && ctx);\n\nlet guardType = {};\nlet guard = fnType.bind(guardType);\n\nfunction filter(Type, arr) {\n  return arr.filter(value => Type.isPrototypeOf(value));\n}\n\nfunction makeTransition(from, to, ...args) {\n  let guards = stack(filter(guardType, args).map(t => t.fn), truthy, callBoth);\n  let reducers = stack(filter(reduceType, args).map(t => t.fn), identity, callForward);\n  return create(this, {\n    from: valueEnumerable(from),\n    to: valueEnumerable(to),\n    guards: valueEnumerable(guards),\n    reducers: valueEnumerable(reducers)\n  });\n}\n\nlet transitionType = {};\nlet immediateType = {};\nlet transition = makeTransition.bind(transitionType);\nlet immediate = makeTransition.bind(immediateType, null);\n\nfunction enterImmediate(machine, service, event) {\n  return transitionTo(service, machine, event, this.immediates) || machine;\n}\n\nfunction transitionsToMap(transitions) {\n  let m = new Map();\n  for(let t of transitions) {\n    if(!m.has(t.from)) m.set(t.from, []);\n    m.get(t.from).push(t);\n  }\n  return m;\n}\n\nlet stateType = { enter: identity };\nfunction state(...args) {\n  let transitions = filter(transitionType, args);\n  let immediates = filter(immediateType, args);\n  let desc = {\n    final: valueEnumerable(args.length === 0),\n    transitions: valueEnumerable(transitionsToMap(transitions))\n  };\n  if(immediates.length) {\n    desc.immediates = valueEnumerable(immediates);\n    desc.enter = valueEnumerable(enterImmediate);\n  }\n  return create(stateType, desc);\n}\n\nlet invokeFnType = {\n  enter(machine2, service, event) {\n    let rn = this.fn.call(service, service.context, event);\n    if(machine.isPrototypeOf(rn))\n      return create(invokeMachineType, {\n        machine: valueEnumerable(rn),\n        transitions: valueEnumerable(this.transitions)\n      }).enter(machine2, service, event)\n    rn.then(data => service.send({ type: 'done', data }))\n      .catch(error => service.send({ type: 'error', error }));\n    return machine2;\n  }\n};\nlet invokeMachineType = {\n  enter(machine, service, event) {\n    service.child = interpret(this.machine, s => {\n      service.onChange(s);\n      if(service.child == s && s.machine.state.value.final) {\n        delete service.child;\n        service.send({ type: 'done', data: s.context });\n      }\n    }, service.context, event);\n    if(service.child.machine.state.value.final) {\n      let data = service.child.context;\n      delete service.child;\n      return transitionTo(service, machine, { type: 'done', data }, this.transitions.get('done'));\n    }\n    return machine;\n  }\n};\nfunction invoke(fn, ...transitions) {\n  let t = valueEnumerable(transitionsToMap(transitions));\n  return machine.isPrototypeOf(fn) ?\n    create(invokeMachineType, {\n      machine: valueEnumerable(fn),\n      transitions: t\n    }) :\n    create(invokeFnType, {\n      fn: valueEnumerable(fn),\n      transitions: t\n    });\n}\n\nlet machine = {\n  get state() {\n    return {\n      name: this.current,\n      value: this.states[this.current]\n    };\n  }\n};\n\nfunction createMachine(current, states, contextFn = empty) {\n  if(typeof current !== 'string') {\n    contextFn = states || empty;\n    states = current;\n    current = Object.keys(states)[0];\n  }\n  if(d._create) d._create(current, states);\n  return create(machine, {\n    context: valueEnumerable(contextFn),\n    current: valueEnumerable(current),\n    states: valueEnumerable(states)\n  });\n}\n\nfunction transitionTo(service, machine, fromEvent, candidates) {\n  let { context } = service;\n  for(let { to, guards, reducers } of candidates) {  \n    if(guards(context, fromEvent)) {\n      service.context = reducers.call(service, context, fromEvent);\n\n      let original = machine.original || machine;\n      let newMachine = create(original, {\n        current: valueEnumerable(to),\n        original: { value: original }\n      });\n\n      if (d._onEnter) d._onEnter(machine, to, service.context, context, fromEvent);\n      let state = newMachine.state.value;\n      return state.enter(newMachine, service, fromEvent);\n    }\n  }\n}\n\nfunction send(service, event) {\n  let eventName = event.type || event;\n  let { machine } = service;\n  let { value: state, name: currentStateName } = machine.state;\n  \n  if(state.transitions.has(eventName)) {\n    return transitionTo(service, machine, event, state.transitions.get(eventName)) || machine;\n  } else {\n    if(d._send) d._send(eventName, currentStateName);\n  }\n  return machine;\n}\n\nlet service = {\n  send(event) {\n    this.machine = send(this, event);\n    \n    // TODO detect change\n    this.onChange(this);\n  }\n};\n\nfunction interpret(machine, onChange, initialContext, event) {\n  let s = Object.create(service, {\n    machine: valueEnumerableWritable(machine),\n    context: valueEnumerableWritable(machine.context(initialContext, event)),\n    onChange: valueEnumerable(onChange)\n  });\n  s.send = s.send.bind(s);\n  s.machine = s.machine.state.value.enter(s.machine, s, event);\n  return s;\n}\n\nexports.action = action;\nexports.createMachine = createMachine;\nexports.d = d;\nexports.guard = guard;\nexports.immediate = immediate;\nexports.interpret = interpret;\nexports.invoke = invoke;\nexports.reduce = reduce;\nexports.state = state;\nexports.transition = transition;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvcm9ib3QzL2Rpc3QvbWFjaGluZS5qcyIsIm1hcHBpbmdzIjoiQUFBYTs7QUFFYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7O0FBRTdEO0FBQ0EsV0FBVztBQUNYOztBQUVBO0FBQ0EsV0FBVztBQUNYOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBLHdCQUF3Qix5QkFBeUI7QUFDakQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLG1DQUFtQyxvQkFBb0I7QUFDdkQscUNBQXFDLHNCQUFzQjtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsK0JBQStCO0FBQ3REO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxvQkFBb0I7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBLFFBQVEsVUFBVTtBQUNsQixZQUFZLHVCQUF1QjtBQUNuQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQixPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUSxVQUFVO0FBQ2xCLFFBQVEsdUNBQXVDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsY0FBYztBQUNkLHFCQUFxQjtBQUNyQixTQUFTO0FBQ1QsYUFBYTtBQUNiLGlCQUFpQjtBQUNqQixpQkFBaUI7QUFDakIsY0FBYztBQUNkLGNBQWM7QUFDZCxhQUFhO0FBQ2Isa0JBQWtCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVtcGxhdGUtMi8uL25vZGVfbW9kdWxlcy9yb2JvdDMvZGlzdC9tYWNoaW5lLmpzP2Q3OWIiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG5mdW5jdGlvbiB2YWx1ZUVudW1lcmFibGUodmFsdWUpIHtcbiAgcmV0dXJuIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWUgfTtcbn1cblxuZnVuY3Rpb24gdmFsdWVFbnVtZXJhYmxlV3JpdGFibGUodmFsdWUpIHtcbiAgcmV0dXJuIHsgZW51bWVyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUsIHZhbHVlIH07XG59XG5cbmxldCBkID0ge307XG5sZXQgdHJ1dGh5ID0gKCkgPT4gdHJ1ZTtcbmxldCBlbXB0eSA9ICgpID0+ICh7fSk7XG5sZXQgaWRlbnRpdHkgPSBhID0+IGE7XG5sZXQgY2FsbEJvdGggPSAocGFyLCBmbiwgc2VsZiwgYXJncykgPT4gcGFyLmFwcGx5KHNlbGYsIGFyZ3MpICYmIGZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xubGV0IGNhbGxGb3J3YXJkID0gKHBhciwgZm4sIHNlbGYsIFthLCBiXSkgPT4gZm4uY2FsbChzZWxmLCBwYXIuY2FsbChzZWxmLCBhLCBiKSwgYik7XG5sZXQgY3JlYXRlID0gKGEsIGIpID0+IE9iamVjdC5mcmVlemUoT2JqZWN0LmNyZWF0ZShhLCBiKSk7XG5cbmZ1bmN0aW9uIHN0YWNrKGZucywgZGVmLCBjYWxsZXIpIHtcbiAgcmV0dXJuIGZucy5yZWR1Y2UoKHBhciwgZm4pID0+IHtcbiAgICByZXR1cm4gZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgcmV0dXJuIGNhbGxlcihwYXIsIGZuLCB0aGlzLCBhcmdzKTtcbiAgICB9O1xuICB9LCBkZWYpO1xufVxuXG5mdW5jdGlvbiBmblR5cGUoZm4pIHtcbiAgcmV0dXJuIGNyZWF0ZSh0aGlzLCB7IGZuOiB2YWx1ZUVudW1lcmFibGUoZm4pIH0pO1xufVxuXG5sZXQgcmVkdWNlVHlwZSA9IHt9O1xubGV0IHJlZHVjZSA9IGZuVHlwZS5iaW5kKHJlZHVjZVR5cGUpO1xubGV0IGFjdGlvbiA9IGZuID0+IHJlZHVjZSgoY3R4LCBldikgPT4gISF+Zm4oY3R4LCBldikgJiYgY3R4KTtcblxubGV0IGd1YXJkVHlwZSA9IHt9O1xubGV0IGd1YXJkID0gZm5UeXBlLmJpbmQoZ3VhcmRUeXBlKTtcblxuZnVuY3Rpb24gZmlsdGVyKFR5cGUsIGFycikge1xuICByZXR1cm4gYXJyLmZpbHRlcih2YWx1ZSA9PiBUeXBlLmlzUHJvdG90eXBlT2YodmFsdWUpKTtcbn1cblxuZnVuY3Rpb24gbWFrZVRyYW5zaXRpb24oZnJvbSwgdG8sIC4uLmFyZ3MpIHtcbiAgbGV0IGd1YXJkcyA9IHN0YWNrKGZpbHRlcihndWFyZFR5cGUsIGFyZ3MpLm1hcCh0ID0+IHQuZm4pLCB0cnV0aHksIGNhbGxCb3RoKTtcbiAgbGV0IHJlZHVjZXJzID0gc3RhY2soZmlsdGVyKHJlZHVjZVR5cGUsIGFyZ3MpLm1hcCh0ID0+IHQuZm4pLCBpZGVudGl0eSwgY2FsbEZvcndhcmQpO1xuICByZXR1cm4gY3JlYXRlKHRoaXMsIHtcbiAgICBmcm9tOiB2YWx1ZUVudW1lcmFibGUoZnJvbSksXG4gICAgdG86IHZhbHVlRW51bWVyYWJsZSh0byksXG4gICAgZ3VhcmRzOiB2YWx1ZUVudW1lcmFibGUoZ3VhcmRzKSxcbiAgICByZWR1Y2VyczogdmFsdWVFbnVtZXJhYmxlKHJlZHVjZXJzKVxuICB9KTtcbn1cblxubGV0IHRyYW5zaXRpb25UeXBlID0ge307XG5sZXQgaW1tZWRpYXRlVHlwZSA9IHt9O1xubGV0IHRyYW5zaXRpb24gPSBtYWtlVHJhbnNpdGlvbi5iaW5kKHRyYW5zaXRpb25UeXBlKTtcbmxldCBpbW1lZGlhdGUgPSBtYWtlVHJhbnNpdGlvbi5iaW5kKGltbWVkaWF0ZVR5cGUsIG51bGwpO1xuXG5mdW5jdGlvbiBlbnRlckltbWVkaWF0ZShtYWNoaW5lLCBzZXJ2aWNlLCBldmVudCkge1xuICByZXR1cm4gdHJhbnNpdGlvblRvKHNlcnZpY2UsIG1hY2hpbmUsIGV2ZW50LCB0aGlzLmltbWVkaWF0ZXMpIHx8IG1hY2hpbmU7XG59XG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25zVG9NYXAodHJhbnNpdGlvbnMpIHtcbiAgbGV0IG0gPSBuZXcgTWFwKCk7XG4gIGZvcihsZXQgdCBvZiB0cmFuc2l0aW9ucykge1xuICAgIGlmKCFtLmhhcyh0LmZyb20pKSBtLnNldCh0LmZyb20sIFtdKTtcbiAgICBtLmdldCh0LmZyb20pLnB1c2godCk7XG4gIH1cbiAgcmV0dXJuIG07XG59XG5cbmxldCBzdGF0ZVR5cGUgPSB7IGVudGVyOiBpZGVudGl0eSB9O1xuZnVuY3Rpb24gc3RhdGUoLi4uYXJncykge1xuICBsZXQgdHJhbnNpdGlvbnMgPSBmaWx0ZXIodHJhbnNpdGlvblR5cGUsIGFyZ3MpO1xuICBsZXQgaW1tZWRpYXRlcyA9IGZpbHRlcihpbW1lZGlhdGVUeXBlLCBhcmdzKTtcbiAgbGV0IGRlc2MgPSB7XG4gICAgZmluYWw6IHZhbHVlRW51bWVyYWJsZShhcmdzLmxlbmd0aCA9PT0gMCksXG4gICAgdHJhbnNpdGlvbnM6IHZhbHVlRW51bWVyYWJsZSh0cmFuc2l0aW9uc1RvTWFwKHRyYW5zaXRpb25zKSlcbiAgfTtcbiAgaWYoaW1tZWRpYXRlcy5sZW5ndGgpIHtcbiAgICBkZXNjLmltbWVkaWF0ZXMgPSB2YWx1ZUVudW1lcmFibGUoaW1tZWRpYXRlcyk7XG4gICAgZGVzYy5lbnRlciA9IHZhbHVlRW51bWVyYWJsZShlbnRlckltbWVkaWF0ZSk7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZShzdGF0ZVR5cGUsIGRlc2MpO1xufVxuXG5sZXQgaW52b2tlRm5UeXBlID0ge1xuICBlbnRlcihtYWNoaW5lMiwgc2VydmljZSwgZXZlbnQpIHtcbiAgICBsZXQgcm4gPSB0aGlzLmZuLmNhbGwoc2VydmljZSwgc2VydmljZS5jb250ZXh0LCBldmVudCk7XG4gICAgaWYobWFjaGluZS5pc1Byb3RvdHlwZU9mKHJuKSlcbiAgICAgIHJldHVybiBjcmVhdGUoaW52b2tlTWFjaGluZVR5cGUsIHtcbiAgICAgICAgbWFjaGluZTogdmFsdWVFbnVtZXJhYmxlKHJuKSxcbiAgICAgICAgdHJhbnNpdGlvbnM6IHZhbHVlRW51bWVyYWJsZSh0aGlzLnRyYW5zaXRpb25zKVxuICAgICAgfSkuZW50ZXIobWFjaGluZTIsIHNlcnZpY2UsIGV2ZW50KVxuICAgIHJuLnRoZW4oZGF0YSA9PiBzZXJ2aWNlLnNlbmQoeyB0eXBlOiAnZG9uZScsIGRhdGEgfSkpXG4gICAgICAuY2F0Y2goZXJyb3IgPT4gc2VydmljZS5zZW5kKHsgdHlwZTogJ2Vycm9yJywgZXJyb3IgfSkpO1xuICAgIHJldHVybiBtYWNoaW5lMjtcbiAgfVxufTtcbmxldCBpbnZva2VNYWNoaW5lVHlwZSA9IHtcbiAgZW50ZXIobWFjaGluZSwgc2VydmljZSwgZXZlbnQpIHtcbiAgICBzZXJ2aWNlLmNoaWxkID0gaW50ZXJwcmV0KHRoaXMubWFjaGluZSwgcyA9PiB7XG4gICAgICBzZXJ2aWNlLm9uQ2hhbmdlKHMpO1xuICAgICAgaWYoc2VydmljZS5jaGlsZCA9PSBzICYmIHMubWFjaGluZS5zdGF0ZS52YWx1ZS5maW5hbCkge1xuICAgICAgICBkZWxldGUgc2VydmljZS5jaGlsZDtcbiAgICAgICAgc2VydmljZS5zZW5kKHsgdHlwZTogJ2RvbmUnLCBkYXRhOiBzLmNvbnRleHQgfSk7XG4gICAgICB9XG4gICAgfSwgc2VydmljZS5jb250ZXh0LCBldmVudCk7XG4gICAgaWYoc2VydmljZS5jaGlsZC5tYWNoaW5lLnN0YXRlLnZhbHVlLmZpbmFsKSB7XG4gICAgICBsZXQgZGF0YSA9IHNlcnZpY2UuY2hpbGQuY29udGV4dDtcbiAgICAgIGRlbGV0ZSBzZXJ2aWNlLmNoaWxkO1xuICAgICAgcmV0dXJuIHRyYW5zaXRpb25UbyhzZXJ2aWNlLCBtYWNoaW5lLCB7IHR5cGU6ICdkb25lJywgZGF0YSB9LCB0aGlzLnRyYW5zaXRpb25zLmdldCgnZG9uZScpKTtcbiAgICB9XG4gICAgcmV0dXJuIG1hY2hpbmU7XG4gIH1cbn07XG5mdW5jdGlvbiBpbnZva2UoZm4sIC4uLnRyYW5zaXRpb25zKSB7XG4gIGxldCB0ID0gdmFsdWVFbnVtZXJhYmxlKHRyYW5zaXRpb25zVG9NYXAodHJhbnNpdGlvbnMpKTtcbiAgcmV0dXJuIG1hY2hpbmUuaXNQcm90b3R5cGVPZihmbikgP1xuICAgIGNyZWF0ZShpbnZva2VNYWNoaW5lVHlwZSwge1xuICAgICAgbWFjaGluZTogdmFsdWVFbnVtZXJhYmxlKGZuKSxcbiAgICAgIHRyYW5zaXRpb25zOiB0XG4gICAgfSkgOlxuICAgIGNyZWF0ZShpbnZva2VGblR5cGUsIHtcbiAgICAgIGZuOiB2YWx1ZUVudW1lcmFibGUoZm4pLFxuICAgICAgdHJhbnNpdGlvbnM6IHRcbiAgICB9KTtcbn1cblxubGV0IG1hY2hpbmUgPSB7XG4gIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogdGhpcy5jdXJyZW50LFxuICAgICAgdmFsdWU6IHRoaXMuc3RhdGVzW3RoaXMuY3VycmVudF1cbiAgICB9O1xuICB9XG59O1xuXG5mdW5jdGlvbiBjcmVhdGVNYWNoaW5lKGN1cnJlbnQsIHN0YXRlcywgY29udGV4dEZuID0gZW1wdHkpIHtcbiAgaWYodHlwZW9mIGN1cnJlbnQgIT09ICdzdHJpbmcnKSB7XG4gICAgY29udGV4dEZuID0gc3RhdGVzIHx8IGVtcHR5O1xuICAgIHN0YXRlcyA9IGN1cnJlbnQ7XG4gICAgY3VycmVudCA9IE9iamVjdC5rZXlzKHN0YXRlcylbMF07XG4gIH1cbiAgaWYoZC5fY3JlYXRlKSBkLl9jcmVhdGUoY3VycmVudCwgc3RhdGVzKTtcbiAgcmV0dXJuIGNyZWF0ZShtYWNoaW5lLCB7XG4gICAgY29udGV4dDogdmFsdWVFbnVtZXJhYmxlKGNvbnRleHRGbiksXG4gICAgY3VycmVudDogdmFsdWVFbnVtZXJhYmxlKGN1cnJlbnQpLFxuICAgIHN0YXRlczogdmFsdWVFbnVtZXJhYmxlKHN0YXRlcylcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25UbyhzZXJ2aWNlLCBtYWNoaW5lLCBmcm9tRXZlbnQsIGNhbmRpZGF0ZXMpIHtcbiAgbGV0IHsgY29udGV4dCB9ID0gc2VydmljZTtcbiAgZm9yKGxldCB7IHRvLCBndWFyZHMsIHJlZHVjZXJzIH0gb2YgY2FuZGlkYXRlcykgeyAgXG4gICAgaWYoZ3VhcmRzKGNvbnRleHQsIGZyb21FdmVudCkpIHtcbiAgICAgIHNlcnZpY2UuY29udGV4dCA9IHJlZHVjZXJzLmNhbGwoc2VydmljZSwgY29udGV4dCwgZnJvbUV2ZW50KTtcblxuICAgICAgbGV0IG9yaWdpbmFsID0gbWFjaGluZS5vcmlnaW5hbCB8fCBtYWNoaW5lO1xuICAgICAgbGV0IG5ld01hY2hpbmUgPSBjcmVhdGUob3JpZ2luYWwsIHtcbiAgICAgICAgY3VycmVudDogdmFsdWVFbnVtZXJhYmxlKHRvKSxcbiAgICAgICAgb3JpZ2luYWw6IHsgdmFsdWU6IG9yaWdpbmFsIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoZC5fb25FbnRlcikgZC5fb25FbnRlcihtYWNoaW5lLCB0bywgc2VydmljZS5jb250ZXh0LCBjb250ZXh0LCBmcm9tRXZlbnQpO1xuICAgICAgbGV0IHN0YXRlID0gbmV3TWFjaGluZS5zdGF0ZS52YWx1ZTtcbiAgICAgIHJldHVybiBzdGF0ZS5lbnRlcihuZXdNYWNoaW5lLCBzZXJ2aWNlLCBmcm9tRXZlbnQpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZW5kKHNlcnZpY2UsIGV2ZW50KSB7XG4gIGxldCBldmVudE5hbWUgPSBldmVudC50eXBlIHx8IGV2ZW50O1xuICBsZXQgeyBtYWNoaW5lIH0gPSBzZXJ2aWNlO1xuICBsZXQgeyB2YWx1ZTogc3RhdGUsIG5hbWU6IGN1cnJlbnRTdGF0ZU5hbWUgfSA9IG1hY2hpbmUuc3RhdGU7XG4gIFxuICBpZihzdGF0ZS50cmFuc2l0aW9ucy5oYXMoZXZlbnROYW1lKSkge1xuICAgIHJldHVybiB0cmFuc2l0aW9uVG8oc2VydmljZSwgbWFjaGluZSwgZXZlbnQsIHN0YXRlLnRyYW5zaXRpb25zLmdldChldmVudE5hbWUpKSB8fCBtYWNoaW5lO1xuICB9IGVsc2Uge1xuICAgIGlmKGQuX3NlbmQpIGQuX3NlbmQoZXZlbnROYW1lLCBjdXJyZW50U3RhdGVOYW1lKTtcbiAgfVxuICByZXR1cm4gbWFjaGluZTtcbn1cblxubGV0IHNlcnZpY2UgPSB7XG4gIHNlbmQoZXZlbnQpIHtcbiAgICB0aGlzLm1hY2hpbmUgPSBzZW5kKHRoaXMsIGV2ZW50KTtcbiAgICBcbiAgICAvLyBUT0RPIGRldGVjdCBjaGFuZ2VcbiAgICB0aGlzLm9uQ2hhbmdlKHRoaXMpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBpbnRlcnByZXQobWFjaGluZSwgb25DaGFuZ2UsIGluaXRpYWxDb250ZXh0LCBldmVudCkge1xuICBsZXQgcyA9IE9iamVjdC5jcmVhdGUoc2VydmljZSwge1xuICAgIG1hY2hpbmU6IHZhbHVlRW51bWVyYWJsZVdyaXRhYmxlKG1hY2hpbmUpLFxuICAgIGNvbnRleHQ6IHZhbHVlRW51bWVyYWJsZVdyaXRhYmxlKG1hY2hpbmUuY29udGV4dChpbml0aWFsQ29udGV4dCwgZXZlbnQpKSxcbiAgICBvbkNoYW5nZTogdmFsdWVFbnVtZXJhYmxlKG9uQ2hhbmdlKVxuICB9KTtcbiAgcy5zZW5kID0gcy5zZW5kLmJpbmQocyk7XG4gIHMubWFjaGluZSA9IHMubWFjaGluZS5zdGF0ZS52YWx1ZS5lbnRlcihzLm1hY2hpbmUsIHMsIGV2ZW50KTtcbiAgcmV0dXJuIHM7XG59XG5cbmV4cG9ydHMuYWN0aW9uID0gYWN0aW9uO1xuZXhwb3J0cy5jcmVhdGVNYWNoaW5lID0gY3JlYXRlTWFjaGluZTtcbmV4cG9ydHMuZCA9IGQ7XG5leHBvcnRzLmd1YXJkID0gZ3VhcmQ7XG5leHBvcnRzLmltbWVkaWF0ZSA9IGltbWVkaWF0ZTtcbmV4cG9ydHMuaW50ZXJwcmV0ID0gaW50ZXJwcmV0O1xuZXhwb3J0cy5pbnZva2UgPSBpbnZva2U7XG5leHBvcnRzLnJlZHVjZSA9IHJlZHVjZTtcbmV4cG9ydHMuc3RhdGUgPSBzdGF0ZTtcbmV4cG9ydHMudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/robot3/dist/machine.js\n");

/***/ })

};
;