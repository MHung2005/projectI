from graph.state import State
from graph.nodes.retrival import call_api
from graph.nodes.llm import call_llm
from langgraph.graph import StateGraph


def build_graph():
    builder = StateGraph(State)

    builder.add_node("retrival", call_api)
    builder.add_node("llm", call_llm)

    builder.set_entry_point("retrival")
    builder.set_finish_point("llm")

    builder.add_edge("retrival", "llm")

    return builder.compile()

graph = build_graph()