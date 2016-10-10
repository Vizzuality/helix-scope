#########################################
#Authors: Alicia A. Arenzana            #
#########################################


import os, fnmatch, zipfile, sys, shutil
import pandas as pd, re


# GLOBALS
indicators = [
['pre', 'precipitation'],
['tavg', 'avg_temperature']
]
columns_in =['ISO','COUNT','AREA','MEAN']
columns_out =['iso','count','area','value','scenario', 'measure', 'season']
scenarios = [
['15', '15'],
['2', '2'],
['4', '45']
]
measures=[
['max', 'max'], 
['med','mean'],
['mean','mean'], 
['sd','sd'],
['min','min']
]
seasons = [
['son', '1'],
['djf', '2'],
['mam', '3'],
['jja', '4']
]
cwd = os.getcwd()
inDataset=[]

# for console comments...
class bcolors:
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    ENDC = '\033[0m'
    UNDERLINE = '\033[4m'

# Functions, Action!
def ensure_dir(f):
    d = os.path.dirname(f)
    if not os.path.exists(d):
        os.mkdir(d)

# Find all files and bind them together to rule them all.   
def find_files(directory, name):
    for root, dirs, files in os.walk(directory):
        for basename in files:
            if fnmatch.fnmatch(basename, name):
                filesource = os.path.join(root, basename)
                base_prnt = basename.rsplit('.', 1)[0]
                file = get_fileData(base_prnt)
                item = {'filePath': filesource, 'indicator':file[0], 'measure': file[1],'scenario': file[2],'season': file[3]}
                if len(item) > 0:
                    inDataset.append(item)
    return inDataset

# file name comprehension
def get_fileData(base_prnt):
    match = re.match(r"([a-z]+)([0-9]+)([a-z]+)", base_prnt, re.I)
    if match:
        items = match.groups()
    
    for ind in indicators:
        if re.search(("^"+ind[0]), items[0]):
            indicator = ind[1]
    for seas in seasons:
        if re.search((seas[0]+"$"), items[0]):
            season = seas[1]
    for scen in scenarios:
        if scen[0] == items[1]:
            scenario = scen[1]
    for meas in measures:
        if meas[0] == items[2]:
            measurement = meas[1]
    return [indicator, measurement, scenario, season]

# Open the files and shape them at will
def openXls(filePath, measure, scenario, season):
    with pd.ExcelFile(filePath) as xls:
        data = pd.read_excel(xls, 0)
        data.rename(columns={'ISO': 'iso', 'COUNT': 'count', 'AREA':'area', 'MEAN':'value'}, inplace=True)
        data["scenario"]=scenario
        data["measure"]=measure
        data["season"]=season
        response = pd.DataFrame(data, columns=columns_out)

        return response

# write each indicator on a file
def writeIndicator(indicatorName, inDatas):
    frames = []
    outData = '/Users/alicia/Projects/my_utils/small_scripts/helixcope/tabular_data/dst/'+ indicatorName +'.csv'
    for data in inDatas:
        x = openXls(data['filePath'], data['measure'], data['scenario'], data['season'])
        frames.append(x)
    f= pd.concat(frames)
    f.to_csv(outData)
    print bcolors.OKGREEN + "SUCCESS" + bcolors.ENDC

#rule them all with iron fist.
def main(cwd, sysargv):
    ensure_dir(cwd+"/dst/")
    dataList = find_files(cwd, sysargv)
    indicatorsList= {data['indicator'] for data in dataList}
    for indicator in indicatorsList:
        print bcolors.OKBLUE + indicator + bcolors.ENDC
        my_indicator = [x for x in dataList if x['indicator'] == indicator]
        writeIndicator(indicator, my_indicator)
    print bcolors.OKGREEN+bcolors.UNDERLINE+'Done, EXIT'+ bcolors.ENDC



# party time
if __name__ == "__main__":

    # check for correct args
    if len(sys.argv) < 2:
        print "Get yo self together: python script.py [target]"
        exit()

    if os.path.exists('dst'):
        shutil.rmtree('dst')

    main(cwd, sys.argv[1])

