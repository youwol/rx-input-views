from pathlib import Path

from youwol.pipelines.pipeline_typescript_weback_npm import Template, PackageType, Dependencies, \
    RunTimeDeps, generate_template

template = Template(
    path=Path(__file__).parent,
    type=PackageType.Library,
    name="@youwol/fv-input",
    version="0.1.1-wip",
    shortDescription="Input widgets using flux-view",
    author="greinisch@youwol.com",
    dependencies=Dependencies(
        runTime=RunTimeDeps(
            load={
                "rxjs": "^6.5.5",
                "@youwol/flux-view": "^0.1.1"
            }
        ),
        devTime={}),
    userGuide=True
    )

generate_template(template)
