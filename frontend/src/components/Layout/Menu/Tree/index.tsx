"use client";

import { ArrowDownIcon, ArrowRightIcon } from "@/components/icons";
import { useAppSelector } from "@/lib/store";
import ApiResponse from "@/models/ApiResponse";
import { TreeType } from "@/models/category";
import api from "@/services/api";
import getTree from "@/services/getTree";
import { filterTree, toTree } from "@/utils/tree";
import { AxiosError } from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

interface TreeProps {
  filter: string;
}

export default function Tree({ filter }: TreeProps) {
  const [tree, setTree] = useState<TreeType[]>([]);

  const {
    data: defaultTree,
    isError,
    isLoading,
    refetch,
  } = useQuery<ApiResponse<TreeType[]>, AxiosError<ApiResponse<string>>>(
    "tree",
    getTree,
  );

  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (defaultTree) {
      if (filter !== "") {
        const findedComponents = filterTree(
          defaultTree.response,
          filter,
          defaultTree.response,
        );
        setTree(toTree(findedComponents, defaultTree.response));
      } else setTree([...defaultTree.response]);
    }
  }, [filter, defaultTree]);

  useEffect(() => {
    refetch();
  }, [categories]);

  const RenderTree = ({
    treeData,
    loop,
  }: {
    treeData: TreeType;
    loop: number;
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      if (filter !== "") setIsOpen(true);
    }, [filter]);

    return (
      <div className="w-full flex flex-col">
        {treeData.parentNode && treeData.parentNode.length > 0 ? (
          <>
            <div
              onClick={() => setIsOpen((prev) => !prev)}
              className="cursor-pointer py-2 w-full hover:bg-gradient-to-r from-surface to-surface2"
            >
              <span
                style={{ paddingLeft: `${loop * loop === 1 ? 10 : 40}px` }}
                className="flex items-center w-full z-20"
              >
                {treeData.parentNode &&
                  treeData.parentNode.length > 0 &&
                  (isOpen ? (
                    <ArrowDownIcon className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowRightIcon className="w-4 h-4 mr-1" />
                  ))}
                <Link
                  href={`/categories/${treeData.id}/articles`}
                  className="hover:underline z-50"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {treeData.name}{" "}
                </Link>
              </span>
            </div>
            <div>
              {isOpen &&
                treeData.parentNode &&
                treeData.parentNode.map((child: any) => (
                  <RenderTree
                    key={child.name}
                    loop={loop + 1}
                    treeData={child}
                  />
                ))}
            </div>
          </>
        ) : (
          <>
            <div className="cursor-pointer py-2 w-full hover:bg-gradient-to-r from-surface to-surface2">
              <Link
                href={`/categories/${treeData.id}/articles`}
                style={{ paddingLeft: `${loop * loop === 1 ? 10 : 40}px` }}
                className="flex items-center w-full hover:underline z-10"
              >
                {treeData.name}
              </Link>
            </div>
          </>
        )}
      </div>
    );
  };

  if (isLoading) return <></>;

  return (
    <div className="mt-2 w-full">
      {tree.length ? (
        tree.map((node, i) => (
          <RenderTree key={`${node.name}-${i}`} treeData={node} loop={1} />
        ))
      ) : (
        <h1 className="text-sm text-center">
          {" "}
          Não foi encontrado nenhuma categoria{" "}
        </h1>
      )}
    </div>
  );
}
