from graph.builder import build_graph

def main():
    state = {
        "prompt": "Linear Regression là gì",
        "context": None,
        'output': None,
    }

    app = build_graph()

    result = app.invoke(state)

    print(result['output'])

if __name__ == '__main__':
    main()
