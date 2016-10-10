#############################################
#Authors: Alicia A. Arenzana & Edward Brett #
#############################################

import sys
import rasterio
import numpy, math
import os, fnmatch, zipfile, shutil

# GLOBALS
indicators = [
['ps', 'precipitation'],
['as', 'avg_temperature']
]

scenarios = [
['r824', '15'],
['r284', '2'],
['r884', '45']
]

cwd = os.getcwd()
rasters = []
rast = []
int_raster_meta = []

# for dank console comments...
class bcolors:
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    ENDC = '\033[0m'
    UNDERLINE = '\033[4m'

## BEGIN DEM FUNCTIONS

# a couple of zips to control them all
def zip_files(directory):
    dst = directory + '/dst'
    ensure_dir(dst+'/zip/')
    counter = 0
    for root, dirs, files in os.walk(dst):
        for basename in files:
            rast.append(basename)
    print 'number rasters: ', len(rast)
    if len(rasters)%10 != 0:
        zip_max_num = numpy.floor((len(rast)/10)) + 1
    else:
        zip_max_num = numpy.floor((len(rast)/10))

    for x in xrange(int(zip_max_num)):
        zip_file = 'dst/zip/compress_' + str(x+1) +'.zip'
        with zipfile.ZipFile(zip_file, 'w') as myzip:
            for x in xrange(10):
                if (counter+x)< len(rast):
                    myzip.write(('dst/'+rast[counter+x]))
                else:
                    break
        counter += 10
        print bcolors.OKBLUE + zip_file + " SUCCESS" + bcolors.ENDC
    print bcolors.OKGREEN+bcolors.UNDERLINE+'Done, EXIT'+ bcolors.ENDC


# find all files ending in .adf with their roots
def find_files(directory, name):
    for root, dirs, files in os.walk(directory):
        for basename in files:
            if fnmatch.fnmatch(basename, name):
                filesource = os.path.join(root, basename)
                base_prnt = root.rsplit('/', 1)[-1]
                filename = get_filename(base_prnt)
                item = [filename, filesource]
                if len(item) > 0:
                    rasters.append(item)
    print rasters
    return rasters

# load files into array and store meta for future checks
def load_files(rasters):
    for raster in rasters:
        with rasterio.open(raster[1], masked=None, driver='AIG') as src:
            meta = src.profile.copy()
            if meta is None:
                print bcolors.WARNING + "Damn son, dat files corrupt" + bcolors.ENDC
                exit()
            else:
                int_raster_meta.append([raster[0], meta])

            # convert that file
            convert_files(raster[0], meta, src)

# convert that file and put it back where you got it from, son
def convert_files(filename, meta, src):

    # update meta
    meta.update(driver='Gtiff', affine=src.affine)
    meta.update(blockxsize=256, blockysize=256, tiled='yes', compress='lzw', dtype=rasterio.float32, crs='EPSG:4326')
    data = src.read()

    # get new file name from folders and assign dst location
    ensure_dir(cwd+"/dst/")
    dst = cwd + "/dst/" + filename + '.tif'

    # finish him
    with rasterio.open(dst, 'w', **meta) as dst:
        for ij, window in dst.block_windows():
            data = src.read(window=window)
            dst.write(data.astype(rasterio.float32), window=window)
            print bcolors.OKGREEN + "SUCCESS" + bcolors.ENDC
            print "file saved in " + cwd + "/dst"

#ensure directory
def ensure_dir(f):
    d = os.path.dirname(f)
    if not os.path.exists(d):
        os.mkdir(d)


# Whats your name? Errrrrrmmm no hablo ingles, gringo.
def get_filename(base_prnt):
    indicator = base_prnt[0:2]
    scenario = base_prnt[3:7]
    season = base_prnt[2]
    measurement = base_prnt[7:]

    for ind in indicators:
        if ind[0] == indicator:
            indicator = ind[1]

    for scen in scenarios:
        if scen[0] == scenario:
            scenario = scen[1]

    filename = indicator + "_" + measurement + "_" + scenario + "_" + season

    return filename


# party time
if __name__ == "__main__":

    # check for correct args
    if len(sys.argv) < 2:
        print "Get yo self together: python script.py [target]"
        exit()

    if os.path.exists('dst'):
        shutil.rmtree('dst')
    # find all dem files, son
    find_files(cwd, sys.argv[1])

    # lets load file meta into an array for conversion checks
    load_files(rasters)

    # zips them all to upload them to carto
    zip_files(cwd)