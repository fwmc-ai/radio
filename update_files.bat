for /r %i in (*) do @if not "%~di%~pi"==".\.git\" touch "%i"
